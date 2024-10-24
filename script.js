document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('user-list');
    const userSelect = document.getElementById('user-select');
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');

    // Récupérer et afficher la liste des utilisateurs
    async function fetchUsers() {
        try {
            const response = await fetch('/users');
            const users = await response.json();

            console.log('Utilisateurs récupérés :', users); // Log des utilisateurs

            // Vider les listes avant de les remplir
            userList.innerHTML = '';
            userSelect.innerHTML = '';
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');
                userItem.innerHTML = `
                    <h3>${user.username}</h3>
                    <div id="tasks-${user.id}">
                        <!-- Les tâches seront ajoutées ici -->
                    </div>
                `;
                userList.appendChild(userItem);

                // Ajouter les utilisateurs dans le dropdown de sélection
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                userSelect.appendChild(option);

                // Récupérer et afficher les tâches de l'utilisateur
                fetchTasks(user.id);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    }

    // Récupérer et afficher les tâches pour un utilisateur
    async function fetchTasks(userId) {
        try {
            const response = await fetch(`/users/${userId}/tasks`);
            const tasks = await response.json();
            
            console.log('Tâches récupérées pour l\'utilisateur', userId, ':', tasks); // Log des tâches

            const taskContainer = document.getElementById(`tasks-${userId}`);

            taskContainer.innerHTML = ''; // Vider les tâches existantes
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <p>${task.task}</p>
                    <button class="delete-task-btn" data-task-id="${task.id}">Supprimer</button>
                `;
                taskContainer.appendChild(taskItem);
            });

            // Ajouter des listeners pour supprimer des tâches
            document.querySelectorAll('.delete-task-btn').forEach(button => {
                button.addEventListener('click', deleteTask);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
        }
    }

    // Ajouter une nouvelle tâche
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = userSelect.value;
        const task = taskInput.value;

        try {
            const response = await fetch(`/users/${userId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task })
            });

            if (response.ok) {
                taskInput.value = ''; // Effacer l'input
                console.log('Tâche ajoutée pour l\'utilisateur', userId); // Log de l'ajout de tâche
                fetchTasks(userId); // Rafraîchir la liste des tâches après l'ajout
            } else {
                console.error('Erreur lors de l\'ajout de la tâche');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la tâche:', error);
        }
    });

    // Supprimer une tâche
    async function deleteTask(event) {
        const taskId = event.target.getAttribute('data-task-id');
        try {
            const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
            if (response.ok) {
                console.log('Tâche supprimée', taskId); // Log de suppression de tâche
                fetchUsers(); // Rafraîchir la liste des utilisateurs et des tâches après suppression
            } else {
                console.error('Erreur lors de la suppression de la tâche');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
        }
    }

    // Récupérer les utilisateurs et les tâches lors du chargement de la page
    fetchUsers();
});
