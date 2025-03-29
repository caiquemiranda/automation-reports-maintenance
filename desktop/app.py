#flet-code
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
import requests
from datetime import datetime
import tempfile
import subprocess

class MaintenanceReportApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Relatórios de Manutenção - Desktop")
        self.root.geometry("800x600")
        
        # Configurar tema
        self.style = ttk.Style()
        self.style.theme_use("clam")
        self.style.configure("TLabel", font=("Arial", 10))
        self.style.configure("TButton", font=("Arial", 10))
        self.style.configure("TEntry", font=("Arial", 10))
        
        # Variáveis de formulário
        self.equipment_var = tk.StringVar()
        self.date_var = tk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        self.technician_var = tk.StringVar()
        
        # Lista de peças utilizadas
        self.parts = []
        
        # Criar interface
        self.create_widgets()
    
    def create_widgets(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Título
        title_label = ttk.Label(main_frame, text="Relatório de Manutenção", font=("Arial", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 20))
        
        # Formulário - Informações gerais
        info_frame = ttk.LabelFrame(main_frame, text="Informações Gerais", padding=10)
        info_frame.grid(row=1, column=0, columnspan=2, sticky="ew", pady=(0, 10))
        
        ttk.Label(info_frame, text="Equipamento:").grid(row=0, column=0, sticky="w", pady=5)
        ttk.Entry(info_frame, textvariable=self.equipment_var, width=40).grid(row=0, column=1, sticky="w", padx=5, pady=5)
        
        ttk.Label(info_frame, text="Data:").grid(row=1, column=0, sticky="w", pady=5)
        ttk.Entry(info_frame, textvariable=self.date_var, width=20).grid(row=1, column=1, sticky="w", padx=5, pady=5)
        
        ttk.Label(info_frame, text="Técnico:").grid(row=2, column=0, sticky="w", pady=5)
        ttk.Entry(info_frame, textvariable=self.technician_var, width=40).grid(row=2, column=1, sticky="w", padx=5, pady=5)
        
        # Descrição do serviço
        service_frame = ttk.LabelFrame(main_frame, text="Descrição do Serviço", padding=10)
        service_frame.grid(row=2, column=0, columnspan=2, sticky="ew", pady=(0, 10))
        
        self.service_text = tk.Text(service_frame, height=5, width=60)
        self.service_text.pack(fill=tk.BOTH, expand=True)
        
        # Peças utilizadas
        parts_frame = ttk.LabelFrame(main_frame, text="Peças Utilizadas", padding=10)
        parts_frame.grid(row=3, column=0, columnspan=2, sticky="ew", pady=(0, 10))
        
        # Lista de peças
        self.parts_tree = ttk.Treeview(parts_frame, columns=("name", "quantity", "notes"), show="headings", height=5)
        self.parts_tree.heading("name", text="Nome")
        self.parts_tree.heading("quantity", text="Quantidade")
        self.parts_tree.heading("notes", text="Observações")
        
        self.parts_tree.column("name", width=250)
        self.parts_tree.column("quantity", width=100)
        self.parts_tree.column("notes", width=250)
        
        self.parts_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Scrollbar para a lista
        scrollbar = ttk.Scrollbar(parts_frame, orient=tk.VERTICAL, command=self.parts_tree.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.parts_tree.configure(yscrollcommand=scrollbar.set)
        
        # Botões para adicionar/remover peças
        parts_btn_frame = ttk.Frame(main_frame)
        parts_btn_frame.grid(row=4, column=0, sticky="w", pady=(0, 10))
        
        ttk.Button(parts_btn_frame, text="Adicionar Peça", command=self.add_part_dialog).grid(row=0, column=0, padx=(0, 10))
        ttk.Button(parts_btn_frame, text="Remover Peça", command=self.remove_part).grid(row=0, column=1)
        
        # Observações
        obs_frame = ttk.LabelFrame(main_frame, text="Observações Adicionais", padding=10)
        obs_frame.grid(row=5, column=0, columnspan=2, sticky="ew", pady=(0, 10))
        
        self.obs_text = tk.Text(obs_frame, height=3, width=60)
        self.obs_text.pack(fill=tk.BOTH, expand=True)
        
        # Botões de ação
        btn_frame = ttk.Frame(main_frame)
        btn_frame.grid(row=6, column=0, columnspan=2, sticky="e", pady=(10, 0))
        
        ttk.Button(btn_frame, text="Limpar", command=self.clear_form).grid(row=0, column=0, padx=(0, 10))
        ttk.Button(btn_frame, text="Gerar Relatório", command=self.generate_report).grid(row=0, column=1)
    
    def add_part_dialog(self):
        # Janela de diálogo para adicionar peça
        dialog = tk.Toplevel(self.root)
        dialog.title("Adicionar Peça")
        dialog.geometry("400x200")
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Variáveis
        name_var = tk.StringVar()
        quantity_var = tk.StringVar(value="1")
        notes_var = tk.StringVar()
        
        # Formulário
        ttk.Label(dialog, text="Nome da Peça:").grid(row=0, column=0, sticky="w", padx=10, pady=5)
        ttk.Entry(dialog, textvariable=name_var, width=30).grid(row=0, column=1, sticky="ew", padx=10, pady=5)
        
        ttk.Label(dialog, text="Quantidade:").grid(row=1, column=0, sticky="w", padx=10, pady=5)
        ttk.Entry(dialog, textvariable=quantity_var, width=10).grid(row=1, column=1, sticky="w", padx=10, pady=5)
        
        ttk.Label(dialog, text="Observações:").grid(row=2, column=0, sticky="w", padx=10, pady=5)
        ttk.Entry(dialog, textvariable=notes_var, width=30).grid(row=2, column=1, sticky="ew", padx=10, pady=5)
        
        # Botões
        btn_frame = ttk.Frame(dialog)
        btn_frame.grid(row=3, column=0, columnspan=2, pady=10)
        
        ttk.Button(btn_frame, text="Cancelar", command=dialog.destroy).grid(row=0, column=0, padx=5)
        
        def add_part():
            try:
                name = name_var.get().strip()
                quantity = int(quantity_var.get())
                notes = notes_var.get().strip()
                
                if not name:
                    messagebox.showerror("Erro", "Digite o nome da peça")
                    return
                
                if quantity <= 0:
                    messagebox.showerror("Erro", "Quantidade deve ser maior que zero")
                    return
                
                # Adicionar à lista
                part = {"name": name, "quantity": quantity, "notes": notes}
                self.parts.append(part)
                
                # Atualizar treeview
                self.parts_tree.insert("", "end", values=(name, quantity, notes))
                
                dialog.destroy()
                
            except ValueError:
                messagebox.showerror("Erro", "Quantidade deve ser um número inteiro")
        
        ttk.Button(btn_frame, text="Adicionar", command=add_part).grid(row=0, column=1, padx=5)
    
    def remove_part(self):
        selected_item = self.parts_tree.selection()
        if selected_item:
            idx = self.parts_tree.index(selected_item[0])
            self.parts_tree.delete(selected_item)
            self.parts.pop(idx)
        else:
            messagebox.showinfo("Informação", "Selecione uma peça para remover")
    
    def clear_form(self):
        self.equipment_var.set("")
        self.date_var.set(datetime.now().strftime("%Y-%m-%d"))
        self.technician_var.set("")
        self.service_text.delete("1.0", tk.END)
        self.obs_text.delete("1.0", tk.END)
        
        # Limpar lista de peças
        self.parts = []
        for item in self.parts_tree.get_children():
            self.parts_tree.delete(item)
    
    def generate_report(self):
        # Validar dados
        equipment = self.equipment_var.get().strip()
        date = self.date_var.get().strip()
        technician = self.technician_var.get().strip()
        service_description = self.service_text.get("1.0", tk.END).strip()
        observations = self.obs_text.get("1.0", tk.END).strip()
        
        if not equipment:
            messagebox.showerror("Erro", "Digite o nome do equipamento")
            return
        
        if not date:
            messagebox.showerror("Erro", "Digite a data")
            return
        
        if not technician:
            messagebox.showerror("Erro", "Digite o nome do técnico")
            return
        
        if not service_description:
            messagebox.showerror("Erro", "Digite a descrição do serviço")
            return
        
        if not self.parts:
            messagebox.showerror("Erro", "Adicione pelo menos uma peça")
            return
        
        # Montar dados para a API
        report_data = {
            "equipment": equipment,
            "date": date,
            "technician": technician,
            "service_description": service_description,
            "parts_used": self.parts,
            "observations": observations
        }
        
        try:
            # Enviar para a API (desabilitado - apenas simulação)
            # response = requests.post("http://localhost:5000/api/generate-report", json=report_data)
            
            # Simulação: criar arquivo JSON com os dados
            file_path = filedialog.asksaveasfilename(
                defaultextension=".json",
                filetypes=[("JSON Files", "*.json"), ("All Files", "*.*")],
                title="Salvar Relatório"
            )
            
            if file_path:
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(report_data, f, ensure_ascii=False, indent=4)
                
                messagebox.showinfo("Sucesso", f"Relatório salvo em {file_path}")
                
                # Opção para abrir o arquivo
                if messagebox.askyesno("Abrir Arquivo", "Deseja abrir o arquivo salvo?"):
                    if os.name == "nt":  # Windows
                        os.startfile(file_path)
                    else:  # Unix/Linux/Mac
                        subprocess.call(["xdg-open", file_path])
        
        except Exception as e:
            messagebox.showerror("Erro", f"Ocorreu um erro: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = MaintenanceReportApp(root)
    root.mainloop()