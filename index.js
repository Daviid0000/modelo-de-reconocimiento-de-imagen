document.addEventListener('DOMContentLoaded', () => {
  const inputFile = document.getElementById('inputFile');
  const elButton = document.getElementById('cargaImagen');
  const image = document.getElementById('image');
  const modeloCargado = document.getElementById('modeloCargado');

  let mobileNetModel = null;

  // Cargo el modelo de MobileNet
  async function loadModel() {
    mobileNetModel = await mobilenet.load();
    console.log('Modelo MobileNet cargado');
    modeloCargado.style.fontSize = '25px'
    modeloCargado.innerText = 'Modelo MobileNet cargado'
  }

  // Leo la imagen seleccionada y la renderizo
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Manejo el evento de carga de la imagen
  elButton.addEventListener('click', async () => {
    const file = inputFile.files[0];
    if (!file) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const imageUrl = await readFile(file);
    image.src = imageUrl;

    // Espero a que la imagen se cargue en el elemento img
    image.onload = async () => {
      if (!mobileNetModel) {
        alert('El modelo MobileNet no se ha cargado todavía. Por favor, espera.');
        return;
      }

      try {
        const predictions = await mobileNetModel.classify(image);
        const nombres = document.getElementById('nombres')
        predictions.forEach(element => {
          const posibilidad = document.createElement('div')
          const nombrePosible = element.className
          posibilidad.style.fontSize = '25px';
          posibilidad.style.marginTop = '20px';

          posibilidad.innerText = nombrePosible

          nombres.appendChild(posibilidad)
          console.log("nombres:", nombrePosible)
        });
      } catch (error) {
        console.error('Error al clasificar la imagen:', error);
      }
    };
  });

  loadModel();
});
