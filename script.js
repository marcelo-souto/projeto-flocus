let modal = document.querySelector(".modal-bg"); // Modal
let cart = [];
let modalKey;

inserirNaSacola()

// Passando pelos itens da array Produtos
produtos.map((item, index) => {
  // Clonando a div modelo do produto e declarando ela como uma variavel
  let produtoItem = document
    .querySelector(".modelo .produto-item")
    .cloneNode(true);

  // Colocando um atributo em cada produto da array com um numero que sera utilizado futuramente como index para pegar itens do array
  produtoItem.setAttribute("data-key", index);

  // Inserindo as informacoes de imagem e nome de cada produto na tela
  produtoItem.style.backgroundImage = `url('${item.imagem[0]}')`; // imagem

  // Adicionando um evento de clique em cada produto, agora disposto na tela
  produtoItem.addEventListener("click", (e) => {
    // Pegando o atribtuto do produto clicado para utiliza-lo como index quando percorrer array
    let key = e.target.getAttribute("data-key");

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
        itemDaLista += `<li style="background-image: url('${item.imagem[saborIndex + 1] }')" data-flavor="${saborIndex}"></li>`;
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

    document.querySelectorAll(".modal-info-tamanhos li").forEach((tamanho) => {
      tamanho.addEventListener("click", (e) => {
        let tamanhoKey = e.target.getAttribute("data-size");

        document.querySelector(
          ".modal-info-price span"
        ).innerHTML = `${produtos[index].preco[tamanhoKey].toFixed(2)}`;

        document
          .querySelector(".modal-info-tamanhos li.active")
          .classList.remove("active");

        tamanho.classList.add("active");

        atualizarTotalModal(index); // Preco do modal atualizado
      });
    });

    document.querySelectorAll(".modal-info-sabores li").forEach((sabor) => {
      sabor.addEventListener("click", () => {
        if (document.querySelector(".modal-info-sabores li.active")) {
          document
            .querySelector(".modal-info-sabores li.active")
            .classList.remove("active");
        }

        sabor.classList.add("active");

        document.querySelector(".msg-obrigatorio").style.opacity = 0;
      });
    });

    document
      .querySelectorAll(".modal-info-adicionais li")
      .forEach((adicional) => {
        adicional.addEventListener("click", () => {
          adicional.classList.toggle("active");

          atualizarTotalModal(index); // Preco do modal atualizado
        });
      });

    abrirModal(modal);
  });

  document.querySelector(".produtos-area").append(produtoItem);
});

// ===========================================================================

function abrirModal(modal) {
  modal.style.opacity = 0;
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.opacity = 1;
  }, 200);
}

function fecharModal() {
  modal.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = "none";
  });
}

document.querySelector(".cancelar").addEventListener("click", fecharModal);

function atualizarTotalModal(indexDoProduto) {
  let precoTamanhoSelecionado = document
    .querySelector(".modal-info-tamanhos li.active")
    .getAttribute("data-size");

  let preco = produtos[indexDoProduto].preco[precoTamanhoSelecionado];

  let precoModal = document.querySelector(".modal-info-price span");

  let adicionais = document.querySelectorAll(
    ".modal-info-adicionais li.active"
  );

  preco += adicionais.length;

  precoModal.innerHTML = preco.toFixed(2);
}

function pegarEscolhasCliente() {
  // Pegando o atributo data do tamanho do produto escolhido
  let escolhaTamanho = modal
    .querySelector(".modal-info-tamanhos li.active")
    .getAttribute("data-size");

  // Pegando o elemento sabor escolhido
  let escolhaSabor = modal.querySelector(".modal-info-sabores li.active");

  // escolhas adicionais
  let escolhaAdicionais = [];
  modal
    .querySelectorAll(".modal-info-adicionais li.active")
    .forEach((itemMarcado) => {
      escolhaAdicionais.push(itemMarcado.getAttribute("data-add"));
    });

  if (escolhaSabor == null) {
    document.querySelector(".msg-obrigatorio").style.opacity = 1;
  } else {
    escolhaSabor = escolhaSabor.getAttribute("data-flavor");

    cart.push({
      id: produtos[modalKey].id,
      tamanho: escolhaTamanho,
      sabor: escolhaSabor,
      adicionais: escolhaAdicionais,
    });

    fecharModal();
  }

  inserirNaSacola();
}

document
  .querySelector(".botao")
  .addEventListener("click", pegarEscolhasCliente);


document.querySelector('.sacola-icone').addEventListener('click', (e) => {
  e.preventDefault()

  document.querySelector('.sacola-wrapper').classList.add('mostrar')
})

document.querySelector('.fechar-icone').addEventListener('click', (e) => {
  e.preventDefault()

  document.querySelector('.sacola-wrapper').classList.remove('mostrar')
})

function inserirNaSacola() {
  document.querySelector(".sacola").innerHTML = "";

  document.querySelector('.sacola-icone').dataset.content = `${cart.length}`

  if (cart.length > 0) {

    document.querySelector('.mensagem-sacola-vazia').style.display = 'none';
    
    document.querySelector('.sacola-container').style.display = 'block';

    let tamanhoDaTela = document.body.clientWidth;
    if (tamanhoDaTela > 560) {
      document.querySelector("aside").classList.add("mostrar");
    }

    let subtotal = 0;
    let total = 0;

    for (let i in cart) {
      let produtoItem = produtos.find((item) => item.id == cart[i].id);

      let sacolaItem = document
        .querySelector(".modelo .sacola-item")
        .cloneNode(true);

      let valorItem = produtoItem.preco[parseInt(cart[i].tamanho)] +
      cart[i].adicionais.length;

      subtotal += valorItem
        
      

      sacolaItem.querySelector(
        ".sacola-display"
      ).style.backgroundImage = `url("${
        produtoItem.imagem[parseInt(cart[i].sabor) + 1]
      }")`;

      sacolaItem.querySelector(".sacola-nome").innerHTML = `${
        produtoItem.nome
      } de ${produtoItem.sabor[cart[i].sabor]}`;

      let sacolaTamanho = sacolaItem.querySelector(".sacola-tamanho");
      sacolaTamanho.innerHTML = produtoItem.tamanho[cart[i].tamanho];

      let itemDaLista = "";
      cart[i].adicionais.forEach((adicional) => {
        sacolaItem.querySelector(".sacola-adicionais").innerHTML =
          itemDaLista += `<li>${produtoItem.adicional[adicional]}</li>`;
      });

      sacolaItem.querySelector('.sacola-valor').innerHTML = `R$ ${valorItem.toFixed(2)}`

      sacolaItem
        .querySelector(".sacola-excluir")
        .addEventListener("click", () => {
          cart.splice(i, 1);

          inserirNaSacola();
        });

      total = subtotal;

      document.querySelector(".sacola-subtotal").innerHTML =
        `R$ ${subtotal.toFixed(2)}`;
      document.querySelector(".sacola-total").innerHTML = `R$ ${total.toFixed(2)}`;

      document.querySelector(".sacola").append(sacolaItem);
    }
  } else {
    document.querySelector('.sacola-container').style.display = 'none';
    document.querySelector('.mensagem-sacola-vazia').style.display = 'grid';
    document.querySelector("aside").classList.remove("mostrar");
  }
}
