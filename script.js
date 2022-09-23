const modal = document.querySelector(".modal-bg"); // Modal
let cart = []; // Array do carrinho
let modalKey; // key do modal

// Roda a função para atualizar o carrinho
inserirNaSacola();

// Passando pelos itens da array Produtos
produtos.map((item, index) => {
  // Clonando a div modelo do produto e declarando ela como uma variavel
  const produtoItem = document
    .querySelector(".modelo .produto-item")
    .cloneNode(true);

  // Colocando um atributo em cada produto da array com um numero que sera utilizado futuramente como index para pegar itens do array
  produtoItem.setAttribute("data-key", index);

  // Inserindo as informacoes de imagem e nome de cada produto na tela
  produtoItem.querySelector(
    ".produto-item-imagem"
  ).style.backgroundImage = `url('${item.imagem[0]}')`; // imagem

  // Adicionando um evento de clique em cada produto, agora disposto na tela
  produtoItem
    .querySelector(".produto-item-imagem")
    .addEventListener("click", (e) => {
      // Pegando o atributo do produto clicado para utiliza-lo como index quando percorrer array
      const key = e.target.closest(".produto-item").getAttribute("data-key");
      // Dar o valor de key a variavel modalKey
      modalKey = key;

      document.querySelector(".msg-obrigatorio").style.opacity = 0;
      // Adiconando imagem do produto na parte de imagem principal do modal
      document.querySelector(
        ".modal-display"
      ).style.backgroundImage = `url('${produtos[key].imagem[0]}')`;

      // Variavel de apoio que sera utilizada para inserir os itens de cada lista
      let itemDaLista = "";

      // Inserindo os tamanhos do produto
      produtos[key].tamanho.forEach((tamanho, tamanhoIndex) => {
        // Inserindo os tamanhos do produto e dando a cada um deles um atributo de tamanho que sera utilizado como index
        document.querySelector(".modal-info-tamanhos").innerHTML =
          itemDaLista += `<li data-size="${tamanhoIndex}">${tamanho}</li>`;
      });

      // Resetando a variavel de apoio para reutilizá-la
      itemDaLista = "";

      // Inserindo os sabores do produto
      produtos[key].sabor.forEach((sabor, saborIndex) => {
        // Inserindo as imagens de referentes a cada sabor e dando a cada uma delas um atributo de sabor que sera utilizado como index
        document.querySelector(".modal-info-sabores").innerHTML =
          itemDaLista += `<li style="background-image: url('${
            item.imagem[saborIndex + 1]
          }')" data-flavor="${saborIndex}"></li>`;
      });

      // Resetando
      itemDaLista = "";

      // Inserindo os adicionais
      produtos[key].adicional.forEach((adicional, adicionalIndex) => {
        // inserindo os adiconais e dando um atributo a cada um deles
        document.querySelector(".modal-info-adicionais").innerHTML =
          itemDaLista += `<li data-add="${adicionalIndex}">${adicional}</li>`;
      });

      // Colocando o tamanho de 500ml como padrão
      document
        .querySelectorAll(".modal-info-tamanhos li")[1]
        .classList.add("active");

      // Colocando o valor total do produto no modal referente ao tamanho padrão
      document.querySelector(".modal-info-price span").innerHTML = `${produtos[
        index
      ].preco[
        document
          .querySelector(".modal-info-tamanhos li.active")
          .getAttribute("data-size")
      ].toFixed(2)}`;

      // Pegando todos elementos de tamanho
      document
        .querySelectorAll(".modal-info-tamanhos li")
        .forEach((tamanho) => {
          // Dando a cada um deles um evento de clique
          tamanho.addEventListener("click", (e) => {
            // Pegando o valor do atributo data-size
            const tamanhoKey = e.target.getAttribute("data-size");
            // Inserindo o preço na parte de preço do modal conforme a escolha do tamanho
            document.querySelector(
              ".modal-info-price span"
            ).innerHTML = `${produtos[index].preco[tamanhoKey].toFixed(2)}`;
            // Tirando a classe active do que estiver aviso, para impedir que escolha mais de um
            document
              .querySelector(".modal-info-tamanhos li.active")
              .classList.remove("active");

            tamanho.classList.add("active");

            atualizarTotalModal(index); // Preco do modal atualizado
          });
        });

      // Pegando todos o elementos sabores e dando a cada um deles o evento de clique
      document.querySelectorAll(".modal-info-sabores li").forEach((sabor) => {
        sabor.addEventListener("click", () => {
          // Se conter a classe active no elemento
          if (document.querySelector(".modal-info-sabores li.active")) {
            // Pega o elemento e tira a classe
            document
              .querySelector(".modal-info-sabores li.active")
              .classList.remove("active");
          }

          // Se clicado adiciona a classe
          sabor.classList.add("active");

          // pega o valor do atributo data-flavor do elemento de sabor que contem a classe active
          const flavorIndex = document
            .querySelector(".modal-info-sabores li.active")
            .getAttribute("data-flavor");
          // Insere no modal-display a imagem referente ao index do sabor ativo
          document.querySelector(
            ".modal-display"
          ).style.backgroundImage = `url("${
            item.imagem[Number(flavorIndex) + 4]
          }")`;
          // Some com a mensagem de obrigatorio, caso marque um sabor
          document.querySelector(".msg-obrigatorio").style.opacity = 0;
        });
      });
      // Pega os elementos referentes aos adicionais e adiciona um evento de clique a cada um deles
      document
        .querySelectorAll(".modal-info-adicionais li")
        .forEach((adicional) => {
          adicional.addEventListener("click", () => {
            // toggle da classe active no elemento, conforme o clique do usuario, podendo marcar e desmarcar
            adicional.classList.toggle("active");

            atualizarTotalModal(index); // Preco do modal atualizado
          });
        });
      // Abre de fato o modal
      abrirModal(modal);
    });
    // Pega a div .produtos-area e dá um append, para adicionar outro e não sobrepor
  document.querySelector(".produtos-area").append(produtoItem);
});




// Função para abrir o modal
function abrirModal(modal) {
  modal.style.opacity = 0;
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.opacity = 1;
  }, 200);
}

// Função para fechar o modal
function fecharModal() {
  modal.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = "none";
  });
}




// Adiciona o evento de clique ao elemento cancelar para fechar o modal
document.querySelector(".cancelar").addEventListener("click", fecharModal);




// Função para atualizar o preço do modal, conforme escolhas de tamanhos e adicionais
function atualizarTotalModal(indexDoProduto) {
  // Pega o valor de data-size do elemento referente ao tamanho
  const precoTamanhoSelecionado = document
    .querySelector(".modal-info-tamanhos li.active")
    .getAttribute("data-size");

  // Percorre a a array conforme o indice do produto, pega o objeto referente a ele, pega a propriedade preco que contem uma array e baseado no data-size, ele encontra o elemento
  let preco = produtos[indexDoProduto].preco[precoTamanhoSelecionado];

  // Parte que recebe o total dentro do modal
  const precoModal = document.querySelector(".modal-info-price span");
  // Pega os adicionais ativos
  const adicionais = document.querySelectorAll(
    ".modal-info-adicionais li.active"
  );

  // pega o preco e adiciona a ele o tamanho da array de adicionais ativos
  preco += adicionais.length;

  // Insere o valor de fato na tela
  precoModal.innerHTML = preco.toFixed(2);
}





// Função que pega as escolhas do cliente no modal
function pegarEscolhasCliente() {
  // Pegando o atributo data do tamanho do produto escolhido
  const escolhaTamanho = modal
    .querySelector(".modal-info-tamanhos li.active")
    .getAttribute("data-size");

  // Pegando o elemento sabor escolhido
  let escolhaSabor = modal.querySelector(".modal-info-sabores li.active");

  // Array vazia que irá receber as escolhas de adicionais
  const escolhaAdicionais = [];
  // Pegando todos adicionais ativos
  modal
    .querySelectorAll(".modal-info-adicionais li.active")
    .forEach((itemMarcado) => {
      // Insere cada adicional na array de escolhasAdicionais baseado no valor contido no atributo data-add de cada adicional
      escolhaAdicionais.push(itemMarcado.getAttribute("data-add"));
    });
  
  // Se não for encontrado algum elemento de sabor que tenha sido escolhido
  if (escolhaSabor == null) {
    // Apareça a mensagem de obrigatório
    document.querySelector(".msg-obrigatorio").style.opacity = 1;
  } else {
    // Se já tiver algum escolhido, pegue o valor do atributo data-flavor dele
    escolhaSabor = escolhaSabor.getAttribute("data-flavor");
    // E insira na array do carrinho o id do produto referente ao data-key do mesmo na array produtos, a escolha de tamanho, sabor e a array de adicionais
    cart.push({
      id: produtos[modalKey].id,
      tamanho: escolhaTamanho,
      sabor: escolhaSabor,
      adicionais: escolhaAdicionais,
    });

    // Fecha o modal
    fecharModal();
  }

  // Atualiza o carrinho
  inserirNaSacola();
}




// Adicionando evento de clique ao botao de adicionar ao carrinho do modal que roda a funçao para atualizar o carrinho
document
  .querySelector(".botao-adicionar")
  .addEventListener("click", pegarEscolhasCliente);


// Adicionando evento de clique ao elemento limpar-sacola para zerar a array do carrinho
document.querySelector(".limpar-sacola").addEventListener("click", () => {
  cart = [];
  // Atualiza o carrinho
  inserirNaSacola();
});


// Adicionando evento de clique ao elemento da sacola no header
document.querySelector(".sacola-icone").addEventListener("click", (e) => {
  e.preventDefault();
  // Adicionando a classe mostrar para o carrinho aparecer
  document.querySelector(".sacola-wrapper").classList.add("mostrar");
});


// Adicionando evento de clique ao elemento fechar-icone
document.querySelector(".fechar-icone").addEventListener("click", (e) => {
  e.preventDefault();
  // Removendo a classe mostrar para o carrinho desaparecer
  document.querySelector(".sacola-wrapper").classList.remove("mostrar");
});





// Função para atualizar o carrinho
function inserirNaSacola() {
  // Pega o elemento sacola e limpa para ele nao repetir os elementos adicionados do carrinho nele
  document.querySelector(".sacola").innerHTML = "";
  // Atualiza o pseudo elemento after do icone da sacola com a quantidade de produtos adicionados ou retirados da array cart
  document.querySelector(".sacola-icone").dataset.content = `${cart.length}`;


  // Se tiver algum item no carrinho:
  if (cart.length > 0) {
    // Aparece o elemento limpar sacola na area da sacola
    document.querySelector(".limpar-sacola").style.display = "block";
    // Some com a mensagem de carrinho vazio
    document.querySelector(".mensagem-sacola-vazia").style.display = "none";
    // Faz aparecer a div que contem os itens adicionados ao carrinho
    document.querySelector(".sacola-container").style.display = "block";
    // Pega a largura da tela
    let tamanhoDaTela = document.body.clientWidth;
    // Se o usuario acessar de um navegador cujo a largura da tela seja maior que 560
    if (tamanhoDaTela > 560) {
      // Apareca a sacola
      document.querySelector("aside").classList.add("mostrar");
    }

    let subtotal = 0; // Subtotal da sacola
    let total = 0; // Total da sacola




    // Passsando pelos itens da array cart
    for (const i in cart) {
      // Encontrando o item na array produtos
      const produtoItem = produtos.find((item) => item.id == cart[i].id);
      // Clonando a div que ira receber as informaçoes de cada produto especificamente
      const sacolaItem = document
        .querySelector(".modelo .sacola-item")
        .cloneNode(true);
      // Valor do item adicionado mais os adicionais
      const valorItem =
        produtoItem.preco[parseInt(cart[i].tamanho)] +
        cart[i].adicionais.length;

      // subtotal = subtotal mais o valor do item adicionado
      subtotal += valorItem;

      // Adicionado a imagem referente ao sabor escolhido na div
      sacolaItem.querySelector(
        ".sacola-display"
      ).style.backgroundImage = `url("${
        produtoItem.imagem[parseInt(cart[i].sabor) + 1]
      }")`;

      // Inserindo o nome e sabor do produto escolhido na div
      sacolaItem.querySelector(".sacola-nome").innerHTML = `${
        produtoItem.nome
      } de ${produtoItem.sabor[cart[i].sabor]}`;

      // Inserindo o tamanho do produto escolhido
      const sacolaTamanho = sacolaItem.querySelector(".sacola-tamanho");
      sacolaTamanho.innerHTML = produtoItem.tamanho[cart[i].tamanho];

      
      let itemDaLista = ""; // Variavel de apoio

      // Percorrendo a array que contem os adicionais do produto
      cart[i].adicionais.forEach((adicional) => {

        // Inserindo os adiconais na ul da sacola do produto especifico
        sacolaItem.querySelector(".sacola-adicionais").innerHTML =
          itemDaLista += `<li>${produtoItem.adicional[adicional]}</li>`;
      });

      // Inserindo o valor do produto especifico na div
      sacolaItem.querySelector(
        ".sacola-valor"
      ).innerHTML = `R$ ${valorItem.toFixed(2)}`;

      // Pegando o elemento excluir e adicionado evento de clique a ele
      sacolaItem
        .querySelector(".sacola-excluir")
        .addEventListener("click", () => {

          // Retirando um item do array cart conforme o indice do item
          cart.splice(i, 1);
          // Atualiza a sacola
          inserirNaSacola();
        });

      total = subtotal; // total = valor do subtotal

      // Inserindo o subtotal na div
      document.querySelector(".sacola-subtotal").innerHTML = `R$ ${subtotal.toFixed(2)}`;
      // Inserindo o subtotal
      document.querySelector(".sacola-total").innerHTML = `R$ ${total.toFixed(2)}`;
      // dando append para adicionar mais um e nao sobreescrever
      document.querySelector(".sacola").append(sacolaItem);
    }

    // Se não tiver item no carrinho
  } else {
    document.querySelector(".limpar-sacola").style.display = "none"; // sumir com o botao de limpar sacola
    document.querySelector(".sacola-container").style.display = "none"; // sumir com a div que recebe os produtos do carrinho
    document.querySelector(".mensagem-sacola-vazia").style.display = "grid"; // aparecer mensagem de sacola vazia
    document.querySelector("aside").classList.remove("mostrar"); // fechar sacola
  }
}
