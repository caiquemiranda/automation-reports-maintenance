document.addEventListener('DOMContentLoaded', function () {
    // Toggle da Sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('main-content-expanded');
        });
    }

    // Toggle dos Submenus
    const submenuItems = document.querySelectorAll('.has-submenu');

    submenuItems.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                if (e.target.parentElement.classList.contains('has-submenu') || e.target.classList.contains('has-submenu')) {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            }
        });
    });

    // Fechar sidebar ao clicar fora em telas pequenas
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('active');
            }
        }
    });

    // Dropdown para perfil, configurações e ajuda
    const profileIcon = document.getElementById('profile-icon');
    const settingsIcon = document.getElementById('settings-icon');
    const helpIcon = document.getElementById('help-icon');

    if (profileIcon) {
        profileIcon.addEventListener('click', function () {
            window.location.href = 'profile.html';
        });
    }

    if (settingsIcon) {
        settingsIcon.addEventListener('click', function () {
            window.location.href = 'settings.html';
        });
    }

    if (helpIcon) {
        helpIcon.addEventListener('click', function () {
            window.location.href = 'help.html';
        });
    }

    // Exportação de dados
    const exportButtons = document.querySelectorAll('.btn-export');

    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const format = this.getAttribute('data-format');
            const dataType = this.getAttribute('data-type');

            alert(`Exportando dados de ${dataType} no formato ${format}...`);
            // Aqui seria implementada a lógica real de exportação
        });
    });

    // Filtros de dados
    const filterButtons = document.querySelectorAll('.btn-filter');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterInputs = document.querySelectorAll('.filter-input');
            let filterParams = {};

            filterInputs.forEach(input => {
                if (input.value) {
                    filterParams[input.getAttribute('name')] = input.value;
                }
            });

            // Aqui seria implementada a lógica real de filtragem com os parâmetros
            console.log('Filtros aplicados:', filterParams);
        });
    });
}); 