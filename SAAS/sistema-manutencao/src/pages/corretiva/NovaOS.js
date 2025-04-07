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
    RadioGroup,
    Radio,
    FormControlLabel,
    Chip,
    IconButton,
    FormLabel,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    FormHelperText
} from '@mui/material';
import {
    Save as SaveIcon,
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Today as CalendarIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import styled from 'styled-components';

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
  
  & > svg {
    margin-right: 8px;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 24px 0;
`;

const UploadButton = styled(Button)`
  margin-top: 16px;
`;

const SignatureCanvas = styled.div`
  border: 1px dashed #ccc;
  height: 150px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
`;

const NovaOSCorretiva = () => {
    const [formData, setFormData] = useState({
        equipamento: '',
        localizacao: '',
        prioridade: 'media',
        descricaoProblema: '',
        statusEquipamento: 'operando',
        tecnicoResponsavel: '',
        dataAbertura: new Date().toISOString().substring(0, 10),
        horaAbertura: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        materiaisNecessarios: [],
        diagnostico: '',
        acaoTomada: '',
        pecasUtilizadas: [],
        documentos: []
    });

    const [novoMaterial, setNovoMaterial] = useState({
        nome: '',
        quantidade: '',
        unidade: ''
    });

    // Lista de equipamentos (exemplo)
    const equipamentos = [
        'Bomba Hidráulica 01',
        'Motor Elétrico 02',
        'Compressor 03',
        'Esteira Transportadora 01',
        'Máquina de Solda 02',
        'Torno CNC 01'
    ];

    // Lista de técnicos (exemplo)
    const tecnicos = [
        'Carlos Silva',
        'João Oliveira',
        'Maria Santos',
        'Paulo Ferreira',
        'Ana Costa'
    ];

    // Lista de localizações (exemplo)
    const localizacoes = [
        'Setor de Produção A',
        'Setor de Produção B',
        'Almoxarifado',
        'Galpão Principal',
        'Setor de Montagem',
        'Área Externa'
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMaterialChange = (e) => {
        const { name, value } = e.target;
        setNovoMaterial({
            ...novoMaterial,
            [name]: value
        });
    };

    const handleAddMaterial = () => {
        if (novoMaterial.nome && novoMaterial.quantidade) {
            setFormData({
                ...formData,
                materiaisNecessarios: [...formData.materiaisNecessarios, { ...novoMaterial, id: Date.now() }]
            });
            setNovoMaterial({
                nome: '',
                quantidade: '',
                unidade: 'un'
            });
        }
    };

    const handleRemoveMaterial = (id) => {
        setFormData({
            ...formData,
            materiaisNecessarios: formData.materiaisNecessarios.filter(material => material.id !== id)
        });
    };

    const handleAddPeca = () => {
        if (novoMaterial.nome.trim() !== '') {
            setFormData({
                ...formData,
                pecasUtilizadas: [...formData.pecasUtilizadas, novoMaterial.nome]
            });
            setNovoMaterial({
                nome: '',
                quantidade: '',
                unidade: ''
            });
        }
    };

    const handleRemovePeca = (index) => {
        const updatedPecas = [...formData.pecasUtilizadas];
        updatedPecas.splice(index, 1);
        setFormData({ ...formData, pecasUtilizadas: updatedPecas });
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const fileNames = files.map(file => file.name);
        setFormData({
            ...formData,
            documentos: [...formData.documentos, ...fileNames]
        });
    };

    const handleRemoveFile = (index) => {
        const updatedDocs = [...formData.documentos];
        updatedDocs.splice(index, 1);
        setFormData({ ...formData, documentos: updatedDocs });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Dados do formulário:', formData);
        // Aqui você enviaria os dados para o backend
        alert('OS Corretiva criada com sucesso!');
    };

    return (
        <div>
            <PageTitle variant="h5">Nova Ordem de Serviço Corretiva</PageTitle>

            <form onSubmit={handleSubmit}>
                {/* Informações do Equipamento */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Informações do Equipamento
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
                                <InputLabel id="localizacao-label">Localização</InputLabel>
                                <Select
                                    labelId="localizacao-label"
                                    name="localizacao"
                                    value={formData.localizacao}
                                    onChange={handleChange}
                                    label="Localização"
                                >
                                    {localizacoes.map((local, index) => (
                                        <MenuItem key={index} value={local}>{local}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label="Descrição do Problema"
                                name="descricaoProblema"
                                value={formData.descricaoProblema}
                                onChange={handleChange}
                                placeholder="Descreva detalhadamente o problema do equipamento..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset" required>
                                <FormLabel component="legend">Status do Equipamento</FormLabel>
                                <RadioGroup
                                    row
                                    name="statusEquipamento"
                                    value={formData.statusEquipamento}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="parado" control={<Radio />} label="Parado" />
                                    <FormControlLabel value="operando" control={<Radio />} label="Operando com limitações" />
                                    <FormControlLabel value="operando_normal" control={<Radio />} label="Operando normalmente" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Responsável e Data */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Responsável e Data
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="tecnico-label">Técnico Responsável</InputLabel>
                                <Select
                                    labelId="tecnico-label"
                                    name="tecnicoResponsavel"
                                    value={formData.tecnicoResponsavel}
                                    onChange={handleChange}
                                    label="Técnico Responsável"
                                >
                                    {tecnicos.map((tec, index) => (
                                        <MenuItem key={index} value={tec}>{tec}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Data de Abertura"
                                name="dataAbertura"
                                value={formData.dataAbertura}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                type="time"
                                label="Hora de Abertura"
                                name="horaAbertura"
                                value={formData.horaAbertura}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Materiais Necessários */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Materiais Necessários
                    </SectionTitle>

                    <Grid container spacing={2} alignItems="flex-end">
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                label="Material"
                                name="nome"
                                value={novoMaterial.nome}
                                onChange={handleMaterialChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField
                                fullWidth
                                label="Quantidade"
                                name="quantidade"
                                type="number"
                                value={novoMaterial.quantidade}
                                onChange={handleMaterialChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Unidade</InputLabel>
                                <Select
                                    name="unidade"
                                    value={novoMaterial.unidade || 'un'}
                                    onChange={handleMaterialChange}
                                    label="Unidade"
                                >
                                    <MenuItem value="un">Unidade</MenuItem>
                                    <MenuItem value="kg">Quilograma</MenuItem>
                                    <MenuItem value="m">Metro</MenuItem>
                                    <MenuItem value="l">Litro</MenuItem>
                                    <MenuItem value="pç">Peça</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddMaterial}
                                fullWidth
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>

                    {formData.materiaisNecessarios.length > 0 && (
                        <Box mt={3}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Materiais Adicionados:
                            </Typography>
                            <List>
                                {formData.materiaisNecessarios.map((material) => (
                                    <ListItem
                                        key={material.id}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => handleRemoveMaterial(material.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={material.nome}
                                            secondary={`Quantidade: ${material.quantidade} ${material.unidade}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </FormSection>

                {/* Campos para Preenchimento Técnico */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Preenchimento Técnico
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Diagnóstico"
                                name="diagnostico"
                                value={formData.diagnostico}
                                onChange={handleChange}
                                placeholder="Diagnóstico detalhado do problema..."
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Ação Tomada"
                                name="acaoTomada"
                                value={formData.acaoTomada}
                                onChange={handleChange}
                                placeholder="Descreva as ações realizadas para resolver o problema..."
                            />
                        </Grid>
                    </Grid>

                    <StyledDivider />

                    <Typography variant="subtitle1" gutterBottom>
                        Peças Utilizadas
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <TextField
                                fullWidth
                                label="Adicionar Peça"
                                value={novoMaterial.nome}
                                onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                                placeholder="Digite o nome da peça utilizada..."
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleAddPeca}
                                sx={{ height: '56px' }}
                                startIcon={<AddIcon />}
                            >
                                Adicionar
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Card variant="outlined" sx={{ mt: 2 }}>
                                <CardContent>
                                    {formData.pecasUtilizadas.length > 0 ? (
                                        <List>
                                            {formData.pecasUtilizadas.map((peca, index) => (
                                                <ListItem key={index} divider={index < formData.pecasUtilizadas.length - 1}>
                                                    <ListItemText primary={peca} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" onClick={() => handleRemovePeca(index)} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography color="textSecondary" align="center">
                                            Nenhuma peça adicionada
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </FormSection>

                {/* Documentos e Assinatura */}
                <FormSection elevation={2}>
                    <SectionTitle variant="h6">
                        Documentos e Assinatura
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Upload de Fotos/Documentos
                            </Typography>

                            <input
                                accept="image/*,application/pdf"
                                style={{ display: 'none' }}
                                id="upload-file"
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="upload-file">
                                <UploadButton
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadIcon />}
                                >
                                    Selecionar Arquivos
                                </UploadButton>
                            </label>

                            <Box sx={{ mt: 2 }}>
                                {formData.documentos.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {formData.documentos.map((doc, index) => (
                                            <Chip
                                                key={index}
                                                label={doc}
                                                onDelete={() => handleRemoveFile(index)}
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography color="textSecondary">
                                        Nenhum arquivo selecionado
                                    </Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Assinatura Digital
                            </Typography>
                            <FormHelperText>Clique na área abaixo para assinar</FormHelperText>
                            <SignatureCanvas>
                                <Typography color="textSecondary">
                                    Área de Assinatura
                                </Typography>
                            </SignatureCanvas>
                            <Button
                                size="small"
                                color="primary"
                                sx={{ mt: 1 }}
                            >
                                Limpar Assinatura
                            </Button>
                        </Grid>
                    </Grid>
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
                        Salvar OS Corretiva
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default NovaOSCorretiva; 