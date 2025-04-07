import React, { useState } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Button,
    Divider,
    Box,
    FormControlLabel,
    Checkbox,
    IconButton,
    FormLabel,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    FormGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip
} from '@mui/material';
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    History as HistoryIcon,
    CheckCircle as CheckCircleIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import styled from 'styled-components';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';

const PageTitle = styled(Typography)`
  margin-bottom: 24px;
  font-weight: 500;
`;

const FormSection = styled(Paper)`
  padding: 24px;
  margin-bottom: 20px;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 500;
  color: #455a64;
  display: flex;
  align-items: center;
`;

const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;

const ChecklistItem = styled(ListItem)`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #fff;
`;

const HistoryItem = styled(Paper)`
  padding: 16px;
  margin-bottom: 12px;
  background-color: #f5f5f5;
  border-left: 4px solid #2196f3;
`;

const NovaOSPlanejada = () => {
    const [formData, setFormData] = useState({
        equipamento: '',
        tipoManutencao: '',
        periodicidade: '',
        dataProgramada: null,
        materiaisPrevistos: [],
        checklist: [
            { id: 1, descricao: 'Verificar níveis de óleo', concluido: false },
            { id: 2, descricao: 'Verificar rolamentos', concluido: false },
            { id: 3, descricao: 'Limpar filtros', concluido: false },
            { id: 4, descricao: 'Verificar tensão das correias', concluido: false },
            { id: 5, descricao: 'Lubrificar articulações', concluido: false }
        ],
        observacoes: ''
    });

    const [novoMaterial, setNovoMaterial] = useState('');
    const [novoItemChecklist, setNovoItemChecklist] = useState('');

    // Dados mockados para exemplos
    const equipamentos = [
        'Bomba Hidráulica 01',
        'Motor Elétrico 02',
        'Compressor 03',
        'Esteira Transportadora 01',
        'Máquina de Solda 02',
        'Torno CNC 01'
    ];

    const tiposManutencao = [
        'Lubrificação',
        'Inspeção',
        'Troca de Peças',
        'Calibração',
        'Limpeza Técnica'
    ];

    const periodicidades = [
        'Diária',
        'Semanal',
        'Quinzenal',
        'Mensal',
        'Trimestral',
        'Semestral',
        'Anual'
    ];

    // Histórico mockado de manutenções anteriores
    const historicoManutencoes = [
        {
            data: '15/03/2023',
            tipo: 'Lubrificação',
            tecnico: 'Carlos Silva',
            observacoes: 'Realizada troca completa de óleo e lubrificantes.'
        },
        {
            data: '22/01/2023',
            tipo: 'Inspeção',
            tecnico: 'Maria Santos',
            observacoes: 'Identificado desgaste nas correias. Programada substituição.'
        },
        {
            data: '05/12/2022',
            tipo: 'Troca de Peças',
            tecnico: 'João Oliveira',
            observacoes: 'Substituídos rolamentos e correias. Equipamento funcionando normalmente.'
        }
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataProgramada: date });
    };

    const handleAddMaterial = () => {
        if (novoMaterial.trim() !== '') {
            setFormData({
                ...formData,
                materiaisPrevistos: [...formData.materiaisPrevistos, novoMaterial]
            });
            setNovoMaterial('');
        }
    };

    const handleRemoveMaterial = (index) => {
        const updatedMateriais = [...formData.materiaisPrevistos];
        updatedMateriais.splice(index, 1);
        setFormData({ ...formData, materiaisPrevistos: updatedMateriais });
    };

    const handleAddItemChecklist = () => {
        if (novoItemChecklist.trim() !== '') {
            const newId = Math.max(...formData.checklist.map(item => item.id), 0) + 1;
            setFormData({
                ...formData,
                checklist: [
                    ...formData.checklist,
                    { id: newId, descricao: novoItemChecklist, concluido: false }
                ]
            });
            setNovoItemChecklist('');
        }
    };

    const handleRemoveItemChecklist = (id) => {
        setFormData({
            ...formData,
            checklist: formData.checklist.filter(item => item.id !== id)
        });
    };

    const handleChecklistItemToggle = (id) => {
        setFormData({
            ...formData,
            checklist: formData.checklist.map(item =>
                item.id === id ? { ...item, concluido: !item.concluido } : item
            )
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Dados do formulário:', formData);
        // Aqui você enviaria os dados para o backend
        alert('OS Planejada criada com sucesso!');
    };

    return (
        <div>
            <PageTitle variant="h5">Nova Ordem de Serviço Planejada</PageTitle>

            <form onSubmit={handleSubmit}>
                {/* Informações do Equipamento */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        <AssignmentIcon sx={{ mr: 1 }} />
                        Informações do Equipamento e Manutenção
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="equipamento-label">Equipamento</InputLabel>
                                <Select
                                    labelId="equipamento-label"
                                    name="equipamento"
                                    value={formData.equipamento}
                                    onChange={handleChange}
                                    label="Equipamento"
                                >
                                    {equipamentos.map((equip, index) => (
                                        <MenuItem key={index} value={equip}>{equip}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="tipo-manutencao-label">Tipo de Manutenção</InputLabel>
                                <Select
                                    labelId="tipo-manutencao-label"
                                    name="tipoManutencao"
                                    value={formData.tipoManutencao}
                                    onChange={handleChange}
                                    label="Tipo de Manutenção"
                                >
                                    {tiposManutencao.map((tipo, index) => (
                                        <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="periodicidade-label">Periodicidade</InputLabel>
                                <Select
                                    labelId="periodicidade-label"
                                    name="periodicidade"
                                    value={formData.periodicidade}
                                    onChange={handleChange}
                                    label="Periodicidade"
                                >
                                    {periodicidades.map((periodo, index) => (
                                        <MenuItem key={index} value={periodo}>{periodo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                <DatePicker
                                    label="Data Programada"
                                    value={formData.dataProgramada}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Checklist de Atividades */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        Checklist de Atividades
                    </SectionTitle>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                label="Adicionar Atividade"
                                value={novoItemChecklist}
                                onChange={(e) => setNovoItemChecklist(e.target.value)}
                                placeholder="Descreva a atividade a ser realizada..."
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleAddItemChecklist}
                                sx={{ height: '56px' }}
                                startIcon={<AddIcon />}
                            >
                                Adicionar
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    <FormLabel component="legend" sx={{ mb: 2 }}>Atividades Planejadas</FormLabel>
                                    <FormGroup>
                                        {formData.checklist.length > 0 ? (
                                            <List>
                                                {formData.checklist.map((item) => (
                                                    <ChecklistItem key={item.id}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={item.concluido}
                                                                    onChange={() => handleChecklistItemToggle(item.id)}
                                                                    name={`checklist-${item.id}`}
                                                                />
                                                            }
                                                            label={item.descricao}
                                                            sx={{ width: '100%' }}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end" onClick={() => handleRemoveItemChecklist(item.id)} color="error">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ChecklistItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography color="textSecondary" align="center">
                                                Nenhuma atividade adicionada
                                            </Typography>
                                        )}
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Materiais Previstos */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Materiais Previstos
                    </SectionTitle>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                label="Adicionar Material"
                                value={novoMaterial}
                                onChange={(e) => setNovoMaterial(e.target.value)}
                                placeholder="Digite o nome do material..."
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleAddMaterial}
                                sx={{ height: '56px' }}
                                startIcon={<AddIcon />}
                            >
                                Adicionar
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    {formData.materiaisPrevistos.length > 0 ? (
                                        <List>
                                            {formData.materiaisPrevistos.map((material, index) => (
                                                <ListItem key={index} divider={index < formData.materiaisPrevistos.length - 1}>
                                                    <ListItemText primary={material} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" onClick={() => handleRemoveMaterial(index)} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography color="textSecondary" align="center">
                                            Nenhum material adicionado
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Histórico de Manutenções */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        <HistoryIcon sx={{ mr: 1 }} />
                        Histórico de Manutenções Anteriores
                    </SectionTitle>

                    {historicoManutencoes.length > 0 ? (
                        <div>
                            {historicoManutencoes.map((historico, index) => (
                                <Accordion key={index} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography fontWeight="500">Data: {historico.data}</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography>{historico.tipo} - Técnico: {historico.tecnico}</Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Observações:</strong> {historico.observacoes}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    ) : (
                        <Typography color="textSecondary" align="center">
                            Nenhum histórico de manutenção disponível
                        </Typography>
                    )}
                </FormSection>

                {/* Observações */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Observações
                    </SectionTitle>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Observações Adicionais"
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        placeholder="Adicione informações relevantes para esta manutenção..."
                    />
                </FormSection>

                {/* Botões de Ação */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 5 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        startIcon={<SaveIcon />}
                    >
                        Salvar OS Planejada
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default NovaOSPlanejada; 