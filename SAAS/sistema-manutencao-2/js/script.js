document.addEventListener('DOMContentLoaded', function () {
    // Toggle da Sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });

    // Toggle dos Submenus
    const submenuItems = document.querySelectorAll('.has-submenu');

    submenuItems.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', function (e) {
            e.preventDefault();
            item.classList.toggle('active');
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
}); 