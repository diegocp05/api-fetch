const apiURL = 'https://jsonplaceholder.typicode.com/users';
const listaUsuarios = document.getElementById('listaUsuarios');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

function mostrarLoader(show) {
  loader.style.display = show ? 'block' : 'none';
}

function exibirToast(mensagem, cor = '#333') {
  toast.textContent = mensagem;
  toast.style.background = cor;
  toast.className = 'show';
  setTimeout(() => toast.className = '', 3000);
}

async function carregarDaAPI() {
  try {
    mostrarLoader(true);
    const resposta = await fetch(apiURL);
    if (!resposta.ok) throw new Error('Erro ao buscar API');
    
    const usuarios = await resposta.json();
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    exibirUsuarios(usuarios);
    exibirToast('Dados carregados da API!', '#4CAF50');
  } catch (error) {
    exibirToast('Erro: ' + error.message, 'crimson');
  } finally {
    mostrarLoader(false);
  }
}

function carregarDoLocalStorage() {
  const dados = localStorage.getItem('usuarios');
  if (!dados) {
    exibirToast('Nenhum dado encontrado no LocalStorage.', 'crimson');
    return;
  }
  const usuarios = JSON.parse(dados);
  exibirUsuarios(usuarios);
  exibirToast('Dados carregados do LocalStorage!', '#4CAF50');
}

function limparLocalStorage() {
  localStorage.removeItem('usuarios');
  listaUsuarios.innerHTML = '';
  exibirToast('LocalStorage limpo.', '#4CAF50');
}

function exibirUsuarios(usuarios) {
  listaUsuarios.innerHTML = '';
  usuarios.slice(0, 10).forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} (${user.email})`;
    listaUsuarios.appendChild(li);
  });
}

function adicionarUsuarioLocal() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !email) {
    exibirToast('Preencha Nome e Email.', 'crimson');
    return;
  }

  if (!validarEmail(email)) {
    exibirToast('Email inválido.', 'crimson');
    return;
  }

  const novoUsuario = { name: nome, email: email };
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  usuarios.unshift(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  exibirUsuarios(usuarios);
  exibirToast('Usuário adicionado localmente!', '#4CAF50');

  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
