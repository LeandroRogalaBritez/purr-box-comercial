# Site comercial — Caixa de Ronrons

Página estática em português do Brasil, inglês e espanhol, feita em HTML, CSS e JavaScript puro. Não precisa de Node, npm, build, banco de dados ou serviços externos. Todas as imagens e os três trailers estão nesta pasta; o site funciona também em um caminho de projeto como `https://leandrorogalabritez.github.io/purr-box-comercial/`.

## Idiomas

O seletor no cabeçalho traduz textos, nomes, botões, legendas, descrições de imagens, rótulos de acessibilidade e metadados. O trailer e seu poster também mudam para o idioma escolhido. Os nomes públicos seguem os catálogos do jogo: **Caixa de Ronrons**, **Purr Box** e **Caja de Ronroneos**.

A escolha fica salva neste navegador. Na primeira visita, o site usa um dos idiomas compatíveis com o navegador e, se nenhum for compatível, português. Links com `?lang=pt`, `?lang=en` ou `?lang=es` abrem diretamente no idioma indicado e têm prioridade sobre a preferência salva. As capturas existentes mostram a interface em português; as versões inglesa e espanhola avisam isso na galeria.

As traduções ficam em `i18n.js`, sem serviços externos ou conexão com uma API. Sem JavaScript, o conteúdo inicial permanece em português.

## Ver antes de publicar

Abra `index.html` no navegador. Para uma prévia por HTTP, execute na raiz do projeto:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Depois acesse `http://127.0.0.1:8080`. O site é de divulgação: não executa o jogo Godot no navegador.

## Repositório e publicação no GitHub Pages

Este repositório contém somente o site comercial. Os scripts, cenas, configurações e histórico do projeto Godot não foram transferidos.

- Repositório: [LeandroRogalaBritez/purr-box-comercial](https://github.com/LeandroRogalaBritez/purr-box-comercial).
- Endereço esperado depois da primeira publicação: [Purr Box](https://leandrorogalabritez.github.io/purr-box-comercial/).
- Branch de publicação: `main`.
- Workflow: `.github/workflows/pages.yml`. Publica os arquivos estáticos da raiz, preservando os caminhos relativos.

### Primeiro commit e envio

No PowerShell:

```powershell
Set-Location -LiteralPath 'D:\Backup\Programacao\Projetos\React\purr-box-comercial'
git add .
git commit -m "site comercial"
git push -u origin main
```

Nenhum commit ou push foi feito durante a transferência: eles ficam para você.

### Ativar o Pages

1. Abra o repositório no GitHub. No plano Free, ele precisa ser público; mantenha o repositório do jogo privado. Se necessário, em **Settings → General → Danger Zone → Change repository visibility**, altere apenas `purr-box-comercial` para **Public**.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions**. O workflow já está incluído; não crie outro template.
4. Abra **Actions → Publicar site comercial → Run workflow**, selecione `main` e confirme **Run workflow**.
5. Aguarde a execução ficar verde. O link aparecerá em **Settings → Pages** e no ambiente `github-pages` da execução.
6. As próximas alterações nos arquivos do site são publicadas automaticamente depois de um push na `main`.

Se o primeiro push executar o workflow antes de o Pages estar ativado, ele pode falhar com `Get Pages site failed` / `Not Found`. Ative o Pages conforme os passos acima e use **Re-run all jobs**, ou execute o workflow manualmente.

Referências oficiais: [configuração da publicação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) e [workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Colocar o link da Steam ou de download

O link oficial da Steam já está configurado nos três botões comerciais, em português, inglês e espanhol. Para alterar a loja ou as legendas, edite `config.js`:

```js
window.RONRONS_CONFIG = {
	storeUrl: "https://store.steampowered.com/app/5376410/Caixa_de_Ronrons/",
	storeLabel: {
		pt: "Adicionar à lista de desejos",
		en: "Add to your wishlist",
		es: "Añadir a tu lista de deseos",
	},
};
```

Use a URL real da loja. Para um link de download, mude os textos de `storeLabel`, por exemplo para `Baixar o jogo`, `Download the game` e `Descargar el juego`. Os três botões comerciais passam a usar esse link e a legenda do idioma selecionado. Uma legenda única em texto também é aceita para compatibilidade. Enquanto `storeUrl` estiver vazio, os botões levam ao trailer, sem anunciar disponibilidade, preço ou data de lançamento.

## Conteúdo e manutenção

- `index.html`: textos, seções, capturas, perguntas frequentes e metadados.
- `styles.css`: cores, layout responsivo e estados de interação.
- `i18n.js`: catálogo completo dos três idiomas e caminhos dos trailers e posters localizados.
- `script.js`: seletor de idioma e preferência local, menu móvel, alternância entre modos e galeria ampliada com navegação por teclado.
- `assets/`: cópias das artes, sprites e capturas existentes no jogo, além das três prévias compactas do trailer (~7 MB cada).

Não há fontes remotas, rastreamento ou coleta de dados. O vídeo só começa quando o visitante der play. O menu, os botões de modo e a galeria funcionam com teclado, e as animações respeitam a preferência por movimento reduzido. Sem JavaScript, os links da galeria abrem as imagens diretamente, e o trailer e as perguntas frequentes continuam funcionando.

Os nomes públicos e os nomes dos gatinhos e minijogos seguem os catálogos do jogo original. Apenas o material comercial foi copiado para este repositório; o código do jogo permanece no projeto Godot.
