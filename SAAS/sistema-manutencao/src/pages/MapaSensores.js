import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Grid,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Divider,
    Button
} from '@mui/material';
import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    Refresh as RefreshIcon,
    FilterAlt as FilterIcon
} from '@mui/icons-material';
import styled from 'styled-components';

// Componentes estilizados
const PageContainer = styled.div`
  padding-bottom: 30px;
`;

const MapContainer = styled(Paper)`
  position: relative;
  height: 600px;
  margin-top: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: url('https://via.placeholder.com/1800x1200/e0e0e0/969696?text=Planta+da+Fábrica');
  background-size: cover;
  background-position: center;
`;

const MapControls = styled(Box)`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: white;
  border-radius: 4px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const DeviceMarker = styled(Box)`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color || '#1976d2'};
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: ${props => props.active ? 3 : 2};
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    background-color: ${props => props.color || '#1976d2'}50;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    animation: ${props => props.active ? 'pulse 1.5s infinite' : 'none'};
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    70% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;

const DeviceInfo = styled(Card)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 300px;
  max-width: calc(100% - 40px);
  z-index: 4;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
`;

const MapaSensores = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [zoom, setZoom] = useState(1);

    // Dados simulados de dispositivos/sensores
    const devices = [
        { id: 1, name: 'Sensor de Temperatura 01', type: 'temperature', status: 'online', x: 25, y: 30, alertLevel: 'normal', reading: '24°C', lastUpdate: '03/05/2023 09:43' },
        { id: 2, name: 'Detector de Fumaça 04', type: 'smoke', status: 'online', x: 40, y: 45, alertLevel: 'normal', reading: 'Normal', lastUpdate: '03/05/2023 09:42' },
        { id: 3, name: 'Sensor de Pressão 02', type: 'pressure', status: 'online', x: 65, y: 35, alertLevel: 'warning', reading: '5.2 bar', lastUpdate: '03/05/2023 09:40' },
        { id: 4, name: 'Sensor de Vibração 03', type: 'vibration', status: 'offline', x: 80, y: 60, alertLevel: 'normal', reading: 'N/A', lastUpdate: '02/05/2023 23:15' },
        { id: 5, name: 'Detector de Fumaça 02', type: 'smoke', status: 'online', x: 35, y: 68, alertLevel: 'normal', reading: 'Normal', lastUpdate: '03/05/2023 09:41' },
        { id: 6, name: 'Sensor de Temperatura 04', type: 'temperature', status: 'online', x: 55, y: 75, alertLevel: 'critical', reading: '95°C', lastUpdate: '03/05/2023 09:44' },
        { id: 7, name: 'Sensor de Fluxo 01', type: 'flow', status: 'online', x: 20, y: 50, alertLevel: 'normal', reading: '150 L/min', lastUpdate: '03/05/2023 09:38' },
        { id: 8, name: 'Sensor de Nível 02', type: 'level', status: 'online', x: 75, y: 20, alertLevel: 'warning', reading: '75%', lastUpdate: '03/05/2023 09:36' }
    ];

    // Filtra dispositivos baseado no termo de busca e tipo
    const filteredDevices = devices.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || device.type === filterType;
        return matchesSearch && matchesType;
    });

    // Obtém a cor baseada no nível de alerta
    const getAlertColor = (alertLevel) => {
        switch (alertLevel) {
            case 'critical':
                return '#d32f2f'; // Vermelho
            case 'warning':
                return '#f57c00'; // Laranja
            case 'normal':
                return '#388e3c'; // Verde
            default:
                return '#757575'; // Cinza
        }
    };

    const handleDeviceClick = (device) => {
        setSelectedDevice(device);
    };

    const handleZoomIn = () => {
        if (zoom < 2) setZoom(zoom + 0.2);
    };

    const handleZoomOut = () => {
        if (zoom > 0.6) setZoom(zoom - 0.2);
    };

    const handleReset = () => {
        setZoom(1);
        setSelectedDevice(null);
    };

    return (
        <PageContainer>
            <Typography variant="h5" fontWeight={500} gutterBottom>
                Ache o Ponto
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Visualize todos os sensores e equipamentos na planta da fábrica, monitore seu status e localize-os rapidamente.
            </Typography>

            {/* Filtros e Busca */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Buscar sensor ou equipamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                        }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filter-type-label">Tipo de Dispositivo</InputLabel>
                        <Select
                            labelId="filter-type-label"
                            value={filterType}
                            label="Tipo de Dispositivo"
                            onChange={(e) => setFilterType(e.target.value)}
                            startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
                        >
                            <MenuItem value="all">Todos os Tipos</MenuItem>
                            <MenuItem value="temperature">Temperatura</MenuItem>
                            <MenuItem value="smoke">Fumaça</MenuItem>
                            <MenuItem value="pressure">Pressão</MenuItem>
                            <MenuItem value="vibration">Vibração</MenuItem>
                            <MenuItem value="flow">Fluxo</MenuItem>
                            <MenuItem value="level">Nível</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        startIcon={<SearchIcon />}
                    >
                        Buscar
                    </Button>
                </Grid>
            </Grid>

            {/* Área do Mapa */}
            <MapContainer elevation={3}>
                {/* Controles do Mapa */}
                <MapControls>
                    <IconButton onClick={handleZoomIn} size="small">
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton onClick={handleZoomOut} size="small">
                        <ZoomOutIcon />
                    </IconButton>
                    <IconButton onClick={handleReset} size="small">
                        <RefreshIcon />
                    </IconButton>
                </MapControls>

                {/* Dispositivos no Mapa */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.3s ease'
                    }}
                >
                    {filteredDevices.map(device => (
                        <DeviceMarker
                            key={device.id}
                            style={{ left: `${device.x}%`, top: `${device.y}%` }}
                            color={getAlertColor(device.alertLevel)}
                            active={selectedDevice?.id === device.id}
                            onClick={() => handleDeviceClick(device)}
                        />
                    ))}
                </Box>

                {/* Informações do Dispositivo Selecionado */}
                {selectedDevice && (
                    <DeviceInfo>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {selectedDevice.name}
                            </Typography>

                            <Box display="flex" alignItems="center" mb={1}>
                                <Chip
                                    size="small"
                                    color={selectedDevice.status === 'online' ? 'success' : 'error'}
                                    label={selectedDevice.status === 'online' ? 'Online' : 'Offline'}
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    size="small"
                                    label={`Alerta: ${selectedDevice.alertLevel.charAt(0).toUpperCase() + selectedDevice.alertLevel.slice(1)}`}
                                    sx={{
                                        bgcolor: getAlertColor(selectedDevice.alertLevel),
                                        color: 'white'
                                    }}
                                />
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <strong>Tipo:</strong> {selectedDevice.type.charAt(0).toUpperCase() + selectedDevice.type.slice(1)}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            <Typography variant="body2" gutterBottom>
                                <strong>Leitura Atual:</strong> {selectedDevice.reading}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                <strong>Última Atualização:</strong> {selectedDevice.lastUpdate}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<LocationIcon />}
                                    onClick={() => alert(`Localização exata: Setor A, Corredor 3, Prateleira 2`)}
                                >
                                    Ver Localização Exata
                                </Button>
                            </Box>
                        </CardContent>
                    </DeviceInfo>
                )}
            </MapContainer>

            {/* Estatísticas dos Dispositivos */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" align="center" fontWeight={500}>
                                {devices.length}
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Dispositivos Totais
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" align="center" fontWeight={500} color="success.main">
                                {devices.filter(d => d.status === 'online').length}
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Dispositivos Online
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" align="center" fontWeight={500} color="error.main">
                                {devices.filter(d => d.status === 'offline').length}
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Dispositivos Offline
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" align="center" fontWeight={500} color="warning.main">
                                {devices.filter(d => d.alertLevel === 'warning' || d.alertLevel === 'critical').length}
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary">
                                Alertas Ativos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default MapaSensores; 