//Генератор цветов sedov.link
function generateColor() {
  let x16color = Math.floor(Math.random() * 16777215).toString(16)
  if (x16color.length < 6) {
    let x16colorLength = x16color.length
    for (let i = x16colorLength; i < 6; i++) {
      x16color = x16color + 'a'
    }
  }
  return '#' + x16color
}

function setImage() {

}

$(document).ready(function () {
  const formClasses = [
    'sedov-link-1',
    // 'sedov-link-2' /* для реализации нескольких колес, необходимо дублировать классы*/
  ]

  //каждая строка отвечает за цвет сектора. Если цветов меньше, чем секторов, то следующий цвет подбирается автоматически
  // const wheelColors = [
  //   '#fcab14',
  //   '#fa6641',
  //   '#be40c0',
  //   '#48cce0',
  //   '#428beb',
  //   '#505add',
  //   '#2d80ce',
  // ]

  const wheelColors = [
    '#FE3E5B',
    '#B7B7B7',
    '#EEEEEE',
    '#FE8F00',
  ]

  var prizes = []
  var form = []
  var wheelBlock = []
  var titlePrizes = []
  var titlePrizesSelector = '.pull-left.form-position-title'
  var wheel = []
  var spinner = []
  var ticker = []
  // на сколько секторов нарезаем круг
  var prizeSlice = []
  // на какое расстояние смещаем сектора друг относительно друга
  var prizeOffset = []
  // прописываем CSS-классы, которые будем добавлять и убирать из стилей
  const spinClass = 'is-spinning'
  const selectedClass = 'selected'
  // получаем все значения параметров стилей у секторов
  var spinnerStyles = []

  // переменная для анимации
  var tickerAnim = []
  // угол вращения
  var rotation = []
  // текущий сектор
  var currentSlice = []
  // переменная для текстовых подписей
  var prizeNodes = []

  //переменная submit form
  var formButton = []

  for (let formKey in formClasses) {
    console.log('formKey', formKey)
    if ($('.' + formClasses[formKey]).eq(1).find('form').length) {
      form[formKey] = $('.' + formClasses[formKey]).eq(1).find('form')
      wheelBlock[formKey] = document.querySelectorAll('.' + formClasses[formKey])[0]
    } else {
      form[formKey] = $('.' + formClasses[formKey]).eq(0).find('form')
      wheelBlock[formKey] = document.querySelectorAll('.' + formClasses[formKey])[1]
    }

    //получаем кнопку form submit
    formButton[formKey] = form[formKey].find('button')

    //заполняем призы и добавляем рандомные цвета
    titlePrizes[formKey] = form[formKey].find(titlePrizesSelector)
    if (titlePrizes[formKey].length > 0) {
      titlePrizes[formKey].each(function (i, e) {
        let title = $(e).text().trim()
        const chance = $(e).siblings('.pull-left.form-position-checker').find('.form-position-input').data('price-delimiter')
        if (title) {
          if (!prizes[formKey]) prizes[formKey] = []
          // let c = typeof (wheelColors) != 'undefined' && wheelColors !== null && wheelColors[i] ? wheelColors[i] : generateColor()
          const c = wheelColors[i % wheelColors.length]
          prizes[formKey].push({ text: title, color: c, chance: chance })
        }
      })
    }

    // создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
    if (!wheelBlock[formKey]) break
    wheel[formKey] = wheelBlock[formKey].querySelector('.deal-wheel')
    spinner[formKey] = wheel[formKey].querySelector('.spinner2')
    ticker[formKey] = wheel[formKey].querySelector('.ticker')

    // на сколько секторов нарезаем круг
    prizeSlice[formKey] = 360 / prizes[formKey].length
    // на какое расстояние смещаем сектора друг относительно друга
    prizeOffset[formKey] = Math.floor(180 / prizes[formKey].length)
    // получаем все значения параметров стилей у секторов
    spinnerStyles[formKey] = window.getComputedStyle(spinner[formKey])

    // переменная для анимации
    tickerAnim[formKey]
    // угол вращения
    rotation[formKey] = 0
    // текущий сектор
    currentSlice[formKey] = 0
    // переменная для текстовых подписей
    prizeNodes[formKey]

    // расставляем текст по секторам
    const createPrizeNodes = () => {
      console.log(prizes)
      // обрабатываем каждую подпись
      prizes[formKey].forEach(({ text, color, reaction }, i) => {
        // каждой из них назначаем свой угол поворота
        rotation[formKey] = ((prizeSlice[formKey] * i) * -1) - prizeOffset[formKey]
        // добавляем код с размещением текста на страницу в конец блока spinner
        spinner[formKey].insertAdjacentHTML(
          'beforeend',
          // текст при этом уже оформлен нужными стилями
          `<li class="prize" data-reaction=${ reaction } style="--rotate: ${ rotation[formKey] }deg">
            <div class="prize-container">
              <span class="text">${ text }</span>
              <img class="image" src="https://fs.getcourse.ru/fileservice/file/download/a/30899/sc/136/h/d66ac740562146140c9cf815a13c3ddf.png" alt="" />
            </div> 
      </li>`,
        )
      })
    }

    // рисуем разноцветные секторы
    const createConicGradient = () => {
      // устанавливаем нужное значение стиля у элемента spinner
      spinner[formKey].setAttribute(
        'style',
        `background: conic-gradient(
      from -90deg,
      ${ prizes[formKey]
          // получаем цвет текущего сектора
          .map((color, i) => color.color + ` ` + (360 / prizes[formKey].length) * (prizes[formKey].length - i - 1) + `deg` + ` ` + (360 / prizes[formKey].length) * (prizes[formKey].length - i) + `deg`)
          .reverse()
        }
    );`,
      )
    }

    // создаём функцию, которая нарисует колесо в сборе
    const setupWheel = () => {
      // сначала секторы
      createConicGradient()
      // потом текст
      createPrizeNodes()
      // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
      prizeNodes[formKey] = wheel[formKey].querySelectorAll('.prize')
    }


    // определяем количество оборотов, которое сделает наше колесо
    const spinertia = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // функция запуска вращения с плавной остановкой
    const runTickerAnimation = () => {
      // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
      const values = spinnerStyles[formKey].transform.split('(')[1].split(')')[0].split(',')
      const a = values[0]
      const b = values[1]
      let rad = Math.atan2(b, a)

      if (rad < 0) rad += (2 * Math.PI)

      const angle = Math.round(rad * (180 / Math.PI))
      const slice = Math.floor(angle / prizeSlice[formKey])

      // анимация язычка, когда его задевает колесо при вращении
      // если появился новый сектор
      if (currentSlice[formKey] !== slice) {
        // убираем анимацию язычка
        ticker[formKey].style.animation = 'none'
        // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
        setTimeout(() => ticker[formKey].style.animation = null, 10000)
        // после того, как язычок прошёл сектор - делаем его текущим
        currentSlice[formKey] = slice
      }
      // запускаем анимацию
      tickerAnim[formKey] = requestAnimationFrame(runTickerAnimation)
    }

    // функция выбора призового сектора
    const selectPrize = () => {
      const selected = selectSector(prizes[formKey])
      console.log(selected)
      prizeNodes[formKey][selected].classList.add(selectedClass)
      setPrize(selected)
    }

    //Выбираем нужный приз в форме
    const setPrize = (selected) => {
      if (titlePrizes[formKey].length > 0) {
        let selectedTitle = $(prizeNodes[formKey][selected]).text().trim()
        console.log('selectedTitle', selectedTitle)
        titlePrizes[formKey].each(function (i, e) {
          let title = $(e).text().trim()
          if (title === selectedTitle) {
            $(e).trigger('click')
          }
        })
      }
    }

    //запускаем колесо
    function startWheel() {
      // делаем её недоступной для нажатия
      formButton[formKey].prop('disabled', true)
      // задаём начальное вращение колеса
      rotation[formKey] = Math.floor(Math.random() * 360 + spinertia(2000, 5000))
      // убираем прошлый приз
      prizeNodes[formKey].forEach((prize) => prize.classList.remove(selectedClass))
      // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
      wheel[formKey].classList.add(spinClass)
      // через CSS говорим секторам, как им повернуться
      spinner[formKey].style.setProperty('--rotate', rotation[formKey])
      // возвращаем язычок в горизонтальную позицию
      ticker[formKey].style.animation = 'none'
      // запускаем анимацию вращения
      runTickerAnimation()
    }

    // отслеживаем, когда закончилась анимация вращения колеса
    spinner[formKey].addEventListener('transitionend', () => {
      // останавливаем отрисовку вращения
      cancelAnimationFrame(tickerAnim[formKey])
      // получаем текущее значение поворота колеса
      rotation[formKey] %= 360
      // выбираем приз
      selectPrize()
      // убираем класс, который отвечает за вращение
      wheel[formKey].classList.remove(spinClass)
      // отправляем в CSS новое положение поворота колеса
      spinner[formKey].style.setProperty('--rotate', rotation[formKey])
      // делаем кнопку снова активной
      formButton[formKey].prop('disabled', false)
      form[formKey].trigger('submit')
    })

    // подготавливаем всё к первому запуску
    setupWheel()

    console.log('formButton', formButton)

    //submit формы по клику кнопке
    formButton[formKey].on('click', function (e) {
      e.preventDefault()
      startWheel()
    })

    // Добавляем функцию для выбора сектора на основе шанса
    function selectSector(sectors) {
      let totalChance = 0
      sectors.forEach(sector => totalChance += sector.chance)
      let randomValue = Math.random() * totalChance

      for (let i = 0; i < sectors.length; i++) {
        randomValue -= sectors[i].chance
        if (randomValue <= 0) {
          return i
        }
      }

      // Возвращаем индекс сектора, если не выбрано других
      return 0
    }
  }
})
