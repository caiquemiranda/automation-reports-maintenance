import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemText,
    InputAdornment,
    Card,
    CardContent,
    Tab,
    Tabs,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Visibility as VisibilityIcon,
    Print as PrintIcon,
    Assignment as AssignmentIcon,
    Close as CloseIcon,
    CalendarMonth as CalendarIcon,
    Build as BuildIcon,
    Person as PersonIcon,
    Download as DownloadIcon,
    FilterAlt as FilterAltIcon
} from '@mui/icons-material';
import styled from 'styled-components';

// Componentes estilizados
const PageContainer = styled.div`
  padding-bottom: 30px;
`;

const FilterSection = styled(Paper)`
  padding: 16px;
  margin-bottom: 20px;
`;

const DrawerHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const StatusChip = styled(Chip)`
  font-weight: 500;
`;

const ConsultaOSCorretiva = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEquipment, setFilterEquipment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTechnician, setFilterTechnician] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedOS, setSelectedOS] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // Dados mockados de ordens de serviço
    const osData = [
        {
            id: 'OS-2023-001',
            equipment: 'Bomba Hidráulica 01',
            problem: 'Vazamento de óleo',
            status: 'completed',
            priority: 'Alta',
            createdAt: '02/05/2023',
            completedAt: '03/05/2023',
            technician: 'Carlos Silva',
            location: 'Setor de Produção A'
        },
        {
            id: 'OS-2023-002',
            equipment: 'Motor Elétrico 02',
            problem: 'Ruído anormal',
            status: 'in_progress',
            priority: 'Média',
            createdAt: '02/05/2023',
            completedAt: null,
            technician: 'Maria Santos',
            location: 'Setor de Produção B'
        },
        {
            id: 'OS-2023-003',
            equipment: 'Compressor 03',
            problem: 'Não liga',
            status: 'pending',
            priority: 'Urgente',
            createdAt: '01/05/2023',
            completedAt: null,
            technician: 'João Oliveira',
            location: 'Almoxarifado'
        },
        {
            id: 'OS-2023-004',
            equipment: 'Esteira Transportadora 01',
            problem: 'Parada intermitente',
            status: 'completed',
            priority: 'Média',
            createdAt: '30/04/2023',
            completedAt: '01/05/2023',
            technician: 'Ana Costa',
            location: 'Galpão Principal'
        },
        {
            id: 'OS-2023-005',
            equipment: 'Máquina de Solda 02',
            problem: 'Sobreaquecimento',
            status: 'in_progress',
            priority: 'Alta',
            createdAt: '29/04/2023',
            completedAt: null,
            technician: 'Paulo Ferreira',
            location: 'Setor de Montagem'
        },
        {
            id: 'OS-2023-006',
            equipment: 'Bomba Hidráulica 02',
            problem: 'Baixa pressão',
            status: 'completed',
            priority: 'Baixa',
            createdAt: '28/04/2023',
            completedAt: '30/04/2023',
            technician: 'Carlos Silva',
            location: 'Área Externa'
        },
    ];

    // Filtra os dados da OS com base nos filtros aplicados
    const filteredOS = osData.filter(os => {
        const matchesSearch =
            os.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            os.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            os.problem.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEquipment = filterEquipment ? os.equipment === filterEquipment : true;
        const matchesStatus = filterStatus ? os.status === filterStatus : true;
        const matchesTechnician = filterTechnician ? os.technician === filterTechnician : true;

        // Filtragem de data seria implementada aqui com lógica mais complexa

        return matchesSearch && matchesEquipment && matchesStatus && matchesTechnician;
    });

    // Manipula a mudança de página na tabela
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Manipula a mudança de linhas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Manipula a abertura do drawer de detalhes
    const handleOpenDetails = (os) => {
        setSelectedOS(os);
        setDrawerOpen(true);
    };

    // Obtém a cor e o texto baseado no status
    const getStatusInfo = (status) => {
        const statusMapping = {
            completed: { color: 'success', label: 'Concluída' },
            in_progress: { color: 'primary', label: 'Em Andamento' },
            pending: { color: 'warning', label: 'Pendente' },
            cancelled: { color: 'error', label: 'Cancelada' }
        };
        return statusMapping[status] || { color: 'default', label: 'Desconhecido' };
    };

    // Lista de equipamentos (para o filtro)
    const equipmentList = [...new Set(osData.map(os => os.equipment))];

    // Lista de técnicos (para o filtro)
    const technicianList = [...new Set(osData.map(os => os.technician))];

    return (
        <PageContainer>
            <Typography variant="h5" fontWeight={500} gutterBottom>
                Consulta de Ordens de Serviço Corretivas
            </Typography>

            {/* Seção de Filtros */}
            <FilterSection elevation={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por ID, equipamento ou descrição..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                startIcon={<FilterAltIcon />}
                                sx={{ mr: 1 }}
                            >
                                Filtros Avançados
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                sx={{ mr: 1 }}
                            >
                                Imprimir
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                            >
                                Exportar
                            </Button>
                        </Box>
                    </Grid>

                    {/* Filtros adicionais */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Equipamento</InputLabel>
                            <Select
                                value={filterEquipment}
                                label="Equipamento"
                                onChange={(e) => setFilterEquipment(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {equipmentList.map((equip, index) => (
                                    <MenuItem key={index} value={equip}>{equip}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterStatus}
                                label="Status"
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="completed">Concluída</MenuItem>
                                <MenuItem value="in_progress">Em Andamento</MenuItem>
                                <MenuItem value="pending">Pendente</MenuItem>
                                <MenuItem value="cancelled">Cancelada</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl size="small" fullWidth>
                            <InputLabel>Técnico</InputLabel>
                            <Select
                                value={filterTechnician}
                                label="Técnico"
                                onChange={(e) => setFilterTechnician(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {technicianList.map((tech, index) => (
                                    <MenuItem key={index} value={tech}>{tech}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Data (a partir de)"
                            type="date"
                            size="small"
                            fullWidth
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </FilterSection>

            {/* Tabela de Ordens de Serviço */}
            <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Equipamento</strong></TableCell>
                            <TableCell><strong>Problema</strong></TableCell>
                            <TableCell><strong>Prioridade</strong></TableCell>
                            <TableCell><strong>Data Criação</strong></TableCell>
                            <TableCell><strong>Técnico</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Ações</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOS
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((os) => {
                                const statusInfo = getStatusInfo(os.status);

                                return (
                                    <TableRow key={os.id} hover>
                                        <TableCell>{os.id}</TableCell>
                                        <TableCell>{os.equipment}</TableCell>
                                        <TableCell>{os.problem}</TableCell>
                                        <TableCell>{os.priority}</TableCell>
                                        <TableCell>{os.createdAt}</TableCell>
                                        <TableCell>{os.technician}</TableCell>
                                        <TableCell>
                                            <StatusChip
                                                label={statusInfo.label}
                                                color={statusInfo.color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Ver detalhes">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleOpenDetails(os)}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Imprimir OS">
                                                <IconButton size="small">
                                                    <PrintIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {filteredOS.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nenhuma ordem de serviço encontrada.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginação */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredOS.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Linhas por página:"
            />

            {/* Drawer de Detalhes */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 450 } } }}
            >
                {selectedOS && (
                    <>
                        <DrawerHeader>
                            <Typography variant="h6" fontWeight={500}>
                                Detalhes da OS
                            </Typography>
                            <IconButton onClick={() => setDrawerOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </DrawerHeader>

                        <Divider />

                        <Box sx={{ p: 2 }}>
                            <Card variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedOS.id}
                                    </Typography>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <StatusChip
                                            label={getStatusInfo(selectedOS.status).label}
                                            color={getStatusInfo(selectedOS.status).color}
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={`Prioridade: ${selectedOS.priority}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Equipamento:</strong> {selectedOS.equipment}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Localização:</strong> {selectedOS.location}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Problema:</strong> {selectedOS.problem}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Técnico:</strong> {selectedOS.technician}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Data de Criação:</strong> {selectedOS.createdAt}
                                    </Typography>
                                    {selectedOS.completedAt && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Data de Conclusão:</strong> {selectedOS.completedAt}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Tabs para diferentes seções de detalhes */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={(e, newValue) => setTabValue(newValue)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    <Tab label="Diagnóstico" icon={<AssignmentIcon />} iconPosition="start" />
                                    <Tab label="Materiais" icon={<BuildIcon />} iconPosition="start" />
                                    <Tab label="Histórico" icon={<CalendarIcon />} iconPosition="start" />
                                    <Tab label="Assinaturas" icon={<PersonIcon />} iconPosition="start" />
                                </Tabs>
                            </Box>

                            {/* Conteúdo da Tab de Diagnóstico */}
                            {tabValue === 0 && (
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Diagnóstico Técnico
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Identificado desgaste na vedação do sistema hidráulico, causando vazamento de óleo. A bomba apresenta sinais de uso prolongado sem manutenção preventiva.
                                    </Typography>

                                    <Typography variant="subtitle1" gutterBottom>
                                        Ação Tomada
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        Substituição completa do kit de vedação e limpeza do sistema. Realizado teste de pressão para confirmar resolução do vazamento.
                                    </Typography>
                                </Box>
                            )}

                            {/* Conteúdo da Tab de Materiais */}
                            {tabValue === 1 && (
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Materiais Utilizados
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary="Kit de Vedação Bomba Hidráulica"
                                                secondary="Código: KV-BH-2023 - Quantidade: 1"
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Óleo Hidráulico ISO 68"
                                                secondary="Código: OH-68 - Quantidade: 5L"
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Junta Metálica 3/4\""
                                            secondary="Código: JM-34 - Quantidade: 2" 
                      />
                                        </ListItem>
                                    </List>
                                </Box>
                            )}

                            {/* Conteúdo da Tab de Histórico */}
                            {tabValue === 2 && (
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Histórico da OS
                                    </Typography>
                                    <List dense>
                                        <ListItem>
                                            <ListItemText
                                                primary="OS Criada"
                                                secondary="02/05/2023 09:15 - Técnico: Carlos Silva"
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Atribuída ao técnico"
                                                secondary="02/05/2023 10:30 - Atribuído por: Gerente Manutenção"
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Início do atendimento"
                                                secondary="02/05/2023 13:45 - Técnico: Carlos Silva"
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                        <ListItem>
                                            <ListItemText
                                                primary="Concluída"
                                                secondary="03/05/2023 11:20 - Técnico: Carlos Silva"
                                            />
                                        </ListItem>
                                    </List>
                                </Box>
                            )}

                            {/* Conteúdo da Tab de Assinaturas */}
                            {tabValue === 3 && (
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Assinaturas
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="body2" align="center" gutterBottom>
                                                    Técnico Responsável
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        height: 80,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: '1px dashed #ccc',
                                                        mb: 1
                                                    }}
                                                >
                                                    <Typography variant="caption" color="text.secondary">
                                                        Assinatura Digital
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" align="center">
                                                    Carlos Silva
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <Typography variant="body2" align="center" gutterBottom>
                                                    Responsável pelo Equipamento
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        height: 80,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: '1px dashed #ccc',
                                                        mb: 1
                                                    }}
                                                >
                                                    <Typography variant="caption" color="text.secondary">
                                                        Assinatura Digital
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" align="center">
                                                    Supervisor Produção
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Ações */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="outlined" startIcon={<PrintIcon />}>
                                    Imprimir OS
                                </Button>
                                <Button variant="contained" onClick={() => setDrawerOpen(false)}>
                                    Fechar
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Drawer>
        </PageContainer>
    );
};

export default ConsultaOSCorretiva; 