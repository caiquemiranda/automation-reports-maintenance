import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    LinearProgress,
    Card,
    CardContent,
    IconButton,
    Avatar
} from '@mui/material';
import {
    Build as BuildIcon,
    CalendarMonth as CalendarIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Alarm as AlarmIcon,
    ArrowForward as ArrowForwardIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import styled from 'styled-components';

// Estilos
const DashboardContainer = styled.div`
  padding-bottom: 40px;
`;

const WelcomeSection = styled.div`
  margin-bottom: 30px;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const StatsCard = styled(Paper)`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const CardIcon = styled.div`
  position: absolute;
  right: -15px;
  top: -15px;
  opacity: 0.1;
  font-size: 100px;
  transform: rotate(15deg);
`;

const ChartContainer = styled(Paper)`
  padding: 20px;
  margin-top: 24px;
`;

const MaintenanceItem = styled(ListItem)`
  border-left: 4px solid ${props => props.statuscolor};
  margin-bottom: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const StatusChip = styled(Chip)`
  font-size: 11px;
  height: 24px;
`;

const Dashboard = () => {
    // Dados simulados para o Dashboard
    const pendingMaintenance = [
        { id: 1, equipment: 'Bomba Hidráulica 01', dueDate: '04/05/2023', priority: 'Alta', status: 'urgent' },
        { id: 2, equipment: 'Motor Elétrico 02', dueDate: '10/05/2023', priority: 'Média', status: 'upcoming' },
        { id: 3, equipment: 'Compressor 03', dueDate: '12/05/2023', priority: 'Baixa', status: 'upcoming' },
        { id: 4, equipment: 'Esteira Transportadora 01', dueDate: '15/05/2023', priority: 'Média', status: 'planned' }
    ];

    const recentActivities = [
        { id: 1, activity: 'Manutenção Corretiva', equipment: 'Máquina de Solda 02', date: '02/05/2023', technician: 'Carlos Silva' },
        { id: 2, activity: 'Inspeção Rotineira', equipment: 'Compressor 01', date: '01/05/2023', technician: 'Maria Santos' },
        { id: 3, activity: 'Troca de Peças', equipment: 'Bomba Hidráulica 03', date: '29/04/2023', technician: 'João Oliveira' }
    ];

    // Mapeia cores baseadas no status
    const getStatusColor = (status) => {
        const colors = {
            urgent: '#f44336',
            upcoming: '#ff9800',
            planned: '#4caf50',
            completed: '#2196f3'
        };
        return colors[status] || '#757575';
    };

    // Mapeia texto baseado no status
    const getStatusLabel = (status) => {
        const labels = {
            urgent: 'Urgente',
            upcoming: 'Próxima',
            planned: 'Planejada',
            completed: 'Concluída'
        };
        return labels[status] || 'Desconhecido';
    };

    return (
        <DashboardContainer>
            <TitleBar>
                <Typography variant="h5" fontWeight={500}>
                    Dashboard
                </Typography>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Última atualização: 03/05/2023 às 09:45
                    </Typography>
                </Box>
            </TitleBar>

            <WelcomeSection>
                <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(to right, #1e3c72, #2a5298)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                                }}
                            >
                                TS
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography variant="h5" color="white" fontWeight={500}>
                                Bem-vindo, Técnico Silva
                            </Typography>
                            <Typography variant="body1" color="rgba(255,255,255,0.8)">
                                Você tem 4 manutenções pendentes e 2 em atraso
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </WelcomeSection>

            {/* Cards de estatísticas */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard elevation={2}>
                        <CardIcon>
                            <BuildIcon style={{ fontSize: 'inherit', color: '#1976d2' }} />
                        </CardIcon>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            OS Corretivas
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight={500}>
                            58
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <TrendingUpIcon color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                12% acima do mês anterior
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={70}
                            sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }}
                            color="primary"
                        />
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard elevation={2}>
                        <CardIcon>
                            <CalendarIcon style={{ fontSize: 'inherit', color: '#9c27b0' }} />
                        </CardIcon>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            OS Planejadas
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight={500}>
                            142
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <TrendingDownIcon color="error" fontSize="small" />
                            <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                                5% abaixo da meta mensal
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={85}
                            sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }}
                            color="secondary"
                        />
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard elevation={2}>
                        <CardIcon>
                            <WarningIcon style={{ fontSize: 'inherit', color: '#ed6c02' }} />
                        </CardIcon>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Em Atraso
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight={500}>
                            7
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <TrendingDownIcon color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                3 a menos que semana passada
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={30}
                            sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }}
                            color="warning"
                        />
                    </StatsCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard elevation={2}>
                        <CardIcon>
                            <CheckCircleIcon style={{ fontSize: 'inherit', color: '#2e7d32' }} />
                        </CardIcon>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Concluídas
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight={500}>
                            203
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <TrendingUpIcon color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                                8% acima do mês anterior
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={90}
                            sx={{ mt: 2, mb: 1, height: 8, borderRadius: 4 }}
                            color="success"
                        />
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Manutenções Pendentes e Atividades Recentes */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={500}>
                                    Manutenções Pendentes
                                </Typography>
                                <IconButton color="primary" size="small">
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>

                            <List>
                                {pendingMaintenance.map((maintenance) => (
                                    <MaintenanceItem
                                        key={maintenance.id}
                                        statuscolor={getStatusColor(maintenance.status)}
                                    >
                                        <ListItemText
                                            primary={maintenance.equipment}
                                            secondary={`Vencimento: ${maintenance.dueDate} • Prioridade: ${maintenance.priority}`}
                                        />
                                        <StatusChip
                                            label={getStatusLabel(maintenance.status)}
                                            size="small"
                                            color={maintenance.status === 'urgent' ? 'error' :
                                                maintenance.status === 'upcoming' ? 'warning' : 'success'}
                                        />
                                    </MaintenanceItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6" fontWeight={500}>
                                    Atividades Recentes
                                </Typography>
                                <IconButton color="primary" size="small">
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Box>

                            <List>
                                {recentActivities.map((activity) => (
                                    <React.Fragment key={activity.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" justifyContent="space-between">
                                                        <Typography variant="body1" fontWeight={500}>
                                                            {activity.activity}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {activity.date}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={`${activity.equipment} • Técnico: ${activity.technician}`}
                                            />
                                        </ListItem>
                                        {activity.id !== recentActivities.length && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Área para Gráfico (Mockup) */}
            <ChartContainer elevation={2}>
                <Typography variant="h6" fontWeight={500} gutterBottom>
                    Desempenho de Manutenção (Últimos 6 meses)
                </Typography>
                <Box sx={{
                    width: '100%',
                    height: 300,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    mt: 2
                }}>
                    <Typography variant="body1" color="text.secondary">
                        Área do Gráfico de Desempenho
                        (Para implementar gráficos reais, considere usar bibliotecas como Recharts ou Chart.js)
                    </Typography>
                </Box>
            </ChartContainer>
        </DashboardContainer>
    );
};

export default Dashboard; 