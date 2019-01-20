let c = document.querySelector('canvas'),
    w = window,
    u = w.z, // undefined
    dpr = devicePixelRatio || 1,
    ww = w.innerWidth,
    wh = w.innerHeight,
    l = document.addEventListener,
    rAQ = requestAnimationFrame,
    ctx = c.getContext('2d'),
    M = Math,
    FONT_SIZE = 20,
    dl = e => {
      e.target.href = c.toDataURL()
      e.target.download = 'canva-golf.png'
    },
    types = {i:0,t:1,r:2}, // types: image, text, rectangle
    elements = [],
    texts = [],
    dragging,
    E = (t,c,x,y,w,h) => ({t,c,x,y,w,h}), // type, content, x, y, width, height
    addImage = i => {
      let iw = i.width,
          ih = i.height,
          dw = iw,
          dh = ih
      if (iw > ih) {   // scale down images so they exactly match
        if (iw > ww) { // one of the dimensions of the screen
          dw = ww
          dh = ih * ww / iw
        }
      } else {
        if (ih > wh) {
          dh = wh
          dw = iw * wh / ih
        }
      }

      // iw > ih
      //     ? iw > ww && (dw = ww, dh = ih * ww / iw)
      //     : ih > wh && (dh = wh, dw = iw * wh / ih);

      elements.push(E(types.i, i, 0, 0, dw, dh))
    },
    addText = t => texts.push(E(types.t, t, ww / 2 - ctx.measureText(t).width / 2, wh / 2 - FONT_SIZE, w, FONT_SIZE)),
    drop = e => {
      e.preventDefault()
      const files = [...e.dataTransfer.items].map(i => i.getAsFile())
      const images = files.map(f => {
        const i = new Image()
        i.onload = () => addImage(i)
        i.src = URL.createObjectURL(f)
      })
    },
    dragover = e => e.preventDefault(),
    pointInElement  = (x,y,e)  => x > e.x && x < e.x + e.w && y > e.y && y < e.y + e.h,
    pointedElement  = (x,y)    => pointedElement_(x, y, texts, texts.length) || pointedElement_(x, y, elements, elements.length),
    // first check last added els (with largest Z index)
    pointedElement_ = (x,y,es,l) => {while (l--) if (pointInElement(x,y,es[l])) return es[l]},
    dragElement = ({ e, dx, dy }, x, y) => {
      e.x = x - dx
      e.y = y - dy
    },
    elementRenderers = [
      e => ctx.drawImage(e.c,e.x,e.y,e.w,e.h),
      e => ctx.fillText(e.c, e.x, e.y + FONT_SIZE),
    ],
    render = _ => {
      ctx.clearRect(0,0,ww,wh)
      elements.concat(texts).forEach(e => elementRenderers[e.t](e))
      rAQ(render)
    }
c.width = ww * dpr
c.height = wh * dpr
ctx.scale(dpr, dpr)
ctx.font = FONT_SIZE + 'pt Serif'
l('mousedown', e => {
  element = pointedElement(e.x, e.y)
  dragging = element && { e: element, dx: e.x - element.x, dy: e.y - element.y }
  l('mouseup',e=>dragging=u)
})
l('mousemove',e=>dragging&&dragElement(dragging,e.x,e.y))
l('keydown',e=>e.key=='t'&&addText('Golf Wang'))
rAQ(render)