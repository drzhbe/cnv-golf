let d = document,
    c = d.querySelector('canvas'),
    w = this,
    u, // undefined
    dpr = devicePixelRatio || 1,
    W = w.innerWidth,
    H = w.innerHeight,
    l = d.addEventListener,
    ctx = c.getContext('2d'),
    FONT_SIZE = 20,
    TEXT = 'Golf Wang',
    dl = e => {
      e.target.href = c.toDataURL()
      e.target.download = 'canva-golf.png'
    },
    types = {i:0,t:1,r:2}, // types: image, text, rectangle
    elements = [],
    texts = [], // separate arrays for elements and texts just to maintain the Z index: text is always on top of images
    dragging,
    E = (t,c,x,y,w,h) => ({t,c,x,y,w,h}), // type, content, x, y, width, height
    addImage = i => {
      let iw = i.width,
          ih = i.height,
          dw = iw,
          dh = ih
      // scale down images so they exactly match
      // one of the dimensions of the screen
      iw > ih
          ? iw > W && (dw = W, dh = ih * W / iw)
          : ih > H && (dh = H, dw = iw * H / ih);
      elements.push(E(types.i, i, 0, 0, dw, dh))
    },
    addText = t => texts.push(E(types.t, t, W / 2 - ctx.measureText(t).width / 2, H / 2 - FONT_SIZE, w, FONT_SIZE)),
    drop = e => {
      e.preventDefault()
      const files = [...e.dataTransfer.items].map(i => i.getAsFile())
      files.forEach(f => {
        const i = new Image()
        i.onload = () => addImage(i)
        i.src = URL.createObjectURL(f)
      })
    },
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
      ctx.clearRect(0,0,W,H)
      elements.concat(texts).forEach(e => elementRenderers[e.t](e))
      requestAnimationFrame(render)
    }
c.width = W * dpr
c.height = H * dpr
ctx.scale(dpr, dpr)
ctx.font = FONT_SIZE + 'pt Serif'
l('mousedown', e => {
  element = pointedElement(e.x, e.y)
  dragging = element && { e: element, dx: e.x - element.x, dy: e.y - element.y } // save the offset from drag start mouse position to the element's top left
})
l('mouseup',e=>dragging=u)
l('mousemove',e=>dragging&&dragElement(dragging,e.x,e.y))
l('keydown',e=>e.key=='t'&&addText(TEXT))
render()