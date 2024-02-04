import p5js from './p5js';

const p5HtmlTemplate = (script: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />

    <style>
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: none;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
      }
      body {
        position: fixed;
      }
    </style>
  </head>
  <body>
    <script>${p5js}</script>
    <script>${script}</script>
  </body>
</html>
`;

export default p5HtmlTemplate;
