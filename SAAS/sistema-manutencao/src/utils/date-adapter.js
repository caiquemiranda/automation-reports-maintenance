import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Adaptador personalizado que importa a localização pt-BR do date-fns
class LocalizedDateFnsAdapter extends AdapterDateFns {
    constructor() {
        super({ locale: ptBR });
    }
}

export default LocalizedDateFnsAdapter; 