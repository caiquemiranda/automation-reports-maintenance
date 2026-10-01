"""ETL do "Entire Historical Log Report" do TSW (SDAI) -> CSV.

Mesma gramática do parser do dashboard (src/lib/parser.js). Cada evento é um bloco:

    <id>  <hh:mm:ss>   <descrição>
                       <continuação da descrição>      (0..n linhas)
          <DOW dd-MON-yy>   (NODE n)
                       <TIPO>      <ESTADO>            (opcional)
                       <detalhe livre>                 (raro)

Uso:  python etl.py log.txt eventos_sdai_completo.csv
"""
import re
import sys

import pandas as pd

START = re.compile(r"^(\d+)\s+(\d{2}:\d{2}:\d{2})\s+(.*)$")
DATE = re.compile(r"^\s+(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{1,2}-[A-Z]{3}-\d{2})(?:\s+\(?NODE\s+(\d+)\)?)?")
# o TSW grava meses em inglês; o locale do sistema não pode interferir
MONTHS = {m: i for i, m in enumerate("JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(), 1)}


def _to_datetime(date: str, time: str) -> pd.Timestamp:
    d, mon, y = date.split("-")
    return pd.Timestamp(f"20{y}-{MONTHS[mon]:02d}-{int(d):02d} {time}")


def parse_sdai_log(filepath: str, output_csv: str | None = None) -> pd.DataFrame:
    blocks, cur = [], None
    with open(filepath, encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.rstrip("\r\n")
            if not line.strip():
                continue
            m = START.match(line)
            if m:
                cur = {"id": int(m[1]), "time": m[2], "desc": [m[3]], "date": None, "node": None, "detail": []}
                blocks.append(cur)
            elif cur is not None:
                d = None if cur["date"] else DATE.match(line)
                if d:
                    cur["date"], cur["node"] = d[1], d[2]
                elif cur["date"] is None:
                    cur["desc"].append(line.strip())  # descrição quebrada em 2+ linhas
                else:
                    cur["detail"].append(line)

    records = []
    for b in blocks:
        if b["date"] is None:
            continue
        type_ = state = detail = ""
        if len(b["detail"]) == 1:
            cols = re.split(r"\s{2,}", b["detail"][0].strip())
            if len(cols) == 2 and not cols[0].startswith("OPERATOR:"):
                type_, state = cols
            else:
                detail = b["detail"][0].strip()
        elif b["detail"]:
            detail = " ".join(x.strip() for x in b["detail"])
        records.append(
            {
                "id": b["id"],
                "datetime": _to_datetime(b["date"], b["time"]),
                "node": int(b["node"]) if b["node"] is not None else pd.NA,
                "description": re.sub(r"\s+", " ", " ".join(b["desc"])).strip(),
                "type": type_,
                "state": state,
            }
        )

    df = pd.DataFrame(records).astype({"node": "Int64"})
    if output_csv:
        df.to_csv(output_csv, index=False)
    return df


if __name__ == "__main__":
    src, dst = (sys.argv[1:3] + ["log.txt", "eventos_sdai_completo.csv"][len(sys.argv[1:3]) :])[:2]
    out = parse_sdai_log(src, dst)
    print(f"{len(out)} eventos -> {dst}")
