const texts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'The Earthquake rumbled and mumbled and grumbled; and then he bumped, and everything tumbled: Bumpyty thump! Thumpyty bump! Houses and palaces all in a lump! “Oh, what a crash! Oh, what a smash! How could I ever be so rash?” The Earthquake cried. “What under the sun Have I gone and done? I never before was so mortified!” Then away he fled, And groaned as he sped: “This comes of not looking before I tread.”',
  'Oh, the beautiful snow! We’re all in a glow: Nell, Dolly, and Willie, and Dan; For the primest of fun, when all’s said and done, is just making a big snow man. Two stones for his eyes look quite owlishly wise, a hard pinch of snow for his nose; then a mouth that’s as big as the snout of a pig, and he’ll want an old pipe, I suppose. Then the snow man is done, and to-morrow what fun: to make piles of snow cannon all day, and to pelt him with balls till he totters and falls, and a thaw comes and melts him away.',
  'All my life I\'ve been extra large, plus I\'m known as a very large fellow. I would easily pass as a school district bus if somebody painted me yellow. "No secret to losing weight," I\'ve been told. "Just cut the fat from your diet." "Get up and about even if it\'s cold." Once again, I decided to try it. But jogging was something senseless to me, and riding a bike seemed insane. Joining a gym involved a large fee, and lifting weights was a pain. So for exercise I choose horseback riding. It\'s fun and easier than it sounds. It\'s a very effective form of dieting \'cause my horse lost forty pounds.'
]

const colours = [
  [0, 163, 108],
  [15, 82, 186],
  [255, 20, 147],
  [255, 20, 147],
  [255, 140, 0],
  [102, 51, 153]
]

const shuffle = (array) => {
  let currentIndex = array.length, randomIndex

  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}

const initCanvas = () => {
  const canvas = $('#c')
  const ctxc = canvas[0]
  const ctx = ctxc.getContext('2d')

  ctxc.width = window.innerWidth
  ctxc.height = window.innerHeight

  ctx.lineCap = 'round'

  let drawEnabled = false
  let mouseDown = false
  let dotFlag = false
  let prevX = 0
  let currX = 0
  let prevY = 0
  let currY = 0

  let colour = 'black'

  const draw = () => {
    ctx.beginPath()
    ctx.moveTo(prevX, prevY)
    ctx.lineTo(currX, currY)
    ctx.strokeStyle = colour
    ctx.lineWidth = (colour === '#fffff0') ? 20 : 5
    ctx.stroke()
    ctx.closePath()
  }

  canvas.on('mousedown touchstart', e => {
    prevX = currX
    prevY = currY
    currX = e.clientX - canvas.offsetLeft
    currY = e.clientY - canvas.offsetTop

    mouseDown = true

    dotFlag = true

    if (dotFlag) {
      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.fillRect(currX, currY, 2, 2)
      ctx.closePath()
      dotFlag = false
    }
  })

  canvas.on('mouseup mouseout touchcancel touchend', e => {
    mouseDown = false
  })

  canvas.on('mousemove', e => {
    if (!mouseDown) return

    prevX = currX
    prevY = currY

    currX = e.clientX
    currY = e.clientY

    draw()
  })

  canvas.on('touchmove', e => {
    if (!mouseDown) return

    prevX = currX
    prevY = currY

    const touch = e.touches[0] || e.changedTouches[0]
    currX = touch.pageX
    currY = touch.pageY

    draw()
  })

  $(window).on('resize', e => {
    const [oldWidth, oldHeight] = [ctxc.width, ctxc.height]
    const image = ctx.getImageData(0, 0, oldWidth, oldHeight)

    ctxc.width = window.innerWidth
    ctxc.height = window.innerHeight

    ctx.putImageData(
      image,
      (window.innerWidth - oldWidth) / 2,
      (window.innerHeight - oldHeight) / 2
    )
  })

  $('.colour').on('click', e => {
    colour = window.getComputedStyle(e.target, null).getPropertyValue('background-color')
  })

  $('#eraser').on('click', e => {
    colour = '#fffff0'
  })

  $('.draw').on('click', e => {
    const drawer = $('#drawer')

    if (drawEnabled) {
      drawer.css('opacity', 0)
      drawer.css('pointer-events', 'none')
      canvas.css('pointer-events', 'none')
    } else {
      drawer.css('opacity', 1)
      drawer.css('pointer-events', 'auto')
      canvas.css('pointer-events', 'auto')
    }

    drawEnabled = !drawEnabled
  })
}

const initAnim = () => {
  let timeout

  const head = $('#head')
  const Head = head[0]

  const toggleName = () => {
    Head.classList.toggle('shrunk')

    const name = $('#name')
    if (name.text() === 'roshan') name.text('rose')
    else name.text('roshan')
  }

  head.on('click', () => {
    clearInterval(timeout)
    toggleName()
  })

  head.on('mouseenter', e => {
    timeout = setInterval(toggleName, 2000)
  })

  head.on('mouseout', e => {
    clearInterval(timeout)
  })
}

const initGame = () => {
  const canvas = document.getElementById('c')
  const gameContainer = document.getElementById('game')
  const mainContainer = document.getElementById('main')
  const gameText = document.getElementById('text')
  const timeText = document.getElementById('time')
  const tick = async () => await new Promise(r => setTimeout(r, 0))

  let currentRound = 0
  let currColour = [0, 0, 0]
  let winColour = [0, 0, 0]
  let time = 10
  let timer = undefined

  const clearText = async () => {
    gameText.style.opacity = '0'
    await tick()
    gameText.textContent = ''
    gameText.style.display = 'none'

    $('#won')
      .css('opacity', 0)
      .css('display', 'none')

    $('#lost')
      .css('opacity', 0)
      .css('display', 'none')
  }

  const winGame = async () => {
    if (timer) clearInterval(timer)
    await clearText()
    timeText.style.opacity = '0'

    $('#won')
      .css('display', 'block')
      .css('opacity', 1)
  }

  const loseGame = async () => {
    if (timer) clearInterval(timer)
    timeText.style.opacity = '0'

    $('.winner').css('text-shadow', '0 0 20px')

    await new Promise(r => setTimeout(r, 1500))
    await clearText()

    $('#lost')
      .css('display', 'block')
      .css('opacity', 1)
  }

  const updateTime = async () => {
    time--
    if (time < 0) return loseGame()
    timeText.textContent = time
  }

  const nextRound = async () => {
    // handle timing
    time = 10
    timeText.style.opacity = '1'
    timeText.textContent = '10'
    if (timer) clearInterval(timer)

    // text
    gameText.style.opacity = '0'
    gameText.style.display = 'block'
    currentRound += 1
    if (currentRound === 11) return winGame()
    gameText.textContent = ''

    // colours
    shuffle(colours)
    currColour = colours[Math.floor(Math.random() * colours.length)]
    winColour = currColour.map(x =>
      x +
      (Math.random() * 0.5 + 0.5) * // random 0.5 - 1
      (10 - (currentRound / 10 * 8)) * 10 * // 25 - 100 based on current round
      Math.pow(-1, Math.round(Math.random()))  // -1 or 1
    )

    winColour = winColour.map(x => Math.max(0, Math.min(255, Math.round(x))))

    await tick()
    timer = setInterval(updateTime, 1000)
    await setText()
  }

  const startGame = async () => {
    gameContainer.style.display = 'flex'
    mainContainer.style.display = 'none'
    canvas.style.opacity = '0'

    await clearText()
    currentRound = 0
    nextRound().then(() => console.log('game started'))
  }

  const resizeText = () => {
    let textHeight, lineHeight, fontSize = 10

    do {
      fontSize += 1
      document.documentElement.style.setProperty('--game-size', fontSize)
      // await (new Promise(r => setTimeout(r, 0)))
      textHeight = gameText.offsetHeight
      lineHeight = Number(
        window.getComputedStyle(gameText, null)
          .getPropertyValue('line-height')
          .replace(/px$/, '')
      )
    } while ((window.innerHeight - (gameText.offsetTop + gameText.offsetHeight)) > lineHeight * 5.5 && fontSize < 200)
  }

  const setText = async () => {
    const tags = []
    shuffle(texts)

    for (const word of texts[Math.floor(Math.random() * texts.length)].split(' ')) {
      let el = document.createElement('span')
      el.textContent = word + ' '
      tags.push(el)
      gameText.appendChild(el)
    }

    resizeText()
    gameText.style.opacity = '1'

    let winner

    do {
      winner = Math.floor(Math.random() * tags.length)
      shuffle(tags)
    } while (tags[winner].textContent.length < 5)

    for (const [i, tag] of tags.entries()) {

      if (i === winner) {
        tag.style.color = `rgb(${winColour[0]}, ${winColour[1]}, ${winColour[2]})`
        tag.classList.add('winner')
        tag.onclick = nextRound
      } else {
        tag.style.color = `rgb(${currColour[0]}, ${currColour[1]}, ${currColour[2]})`
        tag.onclick = e => {
          e.target.style.color = 'black'
        }
      }

      await tick()
    }

  }

  const endGame = async () => {
    await clearText()
    canvas.style.opacity = '1'
    mainContainer.style.display = 'flex'
    gameContainer.style.display = 'none'
  }

  $(window).on('resize', resizeText)
  $('#restart').on('click', startGame)
  $('#startGame').on('click', startGame)
  $('#quit').on('click', endGame)
}

const initImages = () => {
  const hide = $('.img-hide')
  const image = document.getElementById('i')
  let index = 1

  setInterval(() => {
    index += 1
    if (index > 6) index = 1
    image.src = `./images/${index}.jpg`
  }, 1000)

  hide.on('click', () => {
    hide.css('display', 'none')
  })

  $('#show-image').on('click', () => {
    hide.css('display', 'flex')
  })
}

$(document).ready(() => {
  initCanvas()
  initAnim()
  initGame()
  initImages()
})



