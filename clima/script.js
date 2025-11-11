async function buscarClima() {
    const cidade = document.getElementById("cidade").value.trim();
    const apiKey = "19f248d1e9c2cb18bf8ddb96a92ce69a";
    const resultado = document.getElementById("resultado");
    const previsaoDiv = document.getElementById("previsao");
    const tituloPrevisao = document.getElementById("titulo-previsao"); 
    
    const container = document.querySelector(".container");

    // adiciona o efeito de crescimento
    container.classList.add("expandir");

    // depois de 2 segundos, volta ao tamanho normal
    setTimeout(() => {
    container.classList.remove("expandir");
    }, 2000);

    // 🔹 Oculta previsão e título enquanto busca
    previsaoDiv.style.display = "none";
    tituloPrevisao.style.display = "none";
  
    if (!cidade) {
      alert("Digite uma cidade!");
      return;
    }
  
    try {
      // 🔹 Buscar clima atual
      const urlAtual = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${apiKey}`;
      const respostaAtual = await fetch(urlAtual);
      const dadosAtuais = await respostaAtual.json();
  
      if (dadosAtuais.cod !== 200) {
        resultado.innerHTML = `<p>❌ Cidade não encontrada!</p>`;
        return;
      }
  
      const nomeCidade = dadosAtuais.name;
      const temp = dadosAtuais.main.temp;
      const desc = dadosAtuais.weather[0].description;
      const umidade = dadosAtuais.main.humidity;
  
      document.getElementById("nomeCidade").innerText = nomeCidade;
      document.getElementById("temperatura").innerText = `${temp.toFixed(1)}°C`;
      document.getElementById("descricao").innerText =
        desc.charAt(0).toUpperCase() + desc.slice(1);
      document.getElementById("umidade").innerText = `Umidade: ${umidade}%`;
  
      // 🔹 Buscar previsão (5 dias)
      const urlPrev = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&units=metric&lang=pt_br&appid=${apiKey}`;
      const respostaPrev = await fetch(urlPrev);
      const dadosPrev = await respostaPrev.json();
  
      previsaoDiv.innerHTML = "";
  
      // filtrar 1 previsão por dia
      const lista = dadosPrev.list.filter((item, index) => index % 8 === 0);
  
      lista.slice(0, 5).forEach((dia) => {
        const data = new Date(dia.dt * 1000);
        const tempMin = dia.main.temp_min;
        const tempMax = dia.main.temp_max;
        const descricao = dia.weather[0].description;
  
        const item = document.createElement("p");
        item.textContent = `${data.toLocaleDateString("pt-BR")} → ${descricao} | ${tempMin.toFixed(1)}°C - ${tempMax.toFixed(1)}°C`;
        previsaoDiv.appendChild(item);
      });
  
      // ✅ Mostrar previsão e título após carregar
      previsaoDiv.style.display = "flex";
      tituloPrevisao.style.display = "block";
  
    } catch (erro) {
      console.error("Erro ao buscar clima:", erro);
      resultado.innerHTML = "<p>⚠️ Ocorreu um erro. Veja o console (F12).</p>";
    }
  }
  