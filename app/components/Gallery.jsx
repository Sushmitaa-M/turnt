'use client'
import { useEffect, useRef } from 'react'
import '../styles/Gallery.css'

const galleryItems = [
  { id: 1, title: 'Morning Run', sub: 'Run', img: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 2, title: 'Beach Stretch', sub: 'Yoga', img: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 3, title: 'Sunset Sprint', sub: 'Sprint', img: 'https://images.pexels.com/photos/1571939/pexels-photo-1571939.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 4, title: 'Group Vibe', sub: 'Together', img: 'https://images.pexels.com/photos/3621185/pexels-photo-3621185.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 5, title: 'Sand Game', sub: 'Play', img: 'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 6, title: 'Cool Down', sub: 'Rest', img: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 7, title: 'Wave Chase', sub: 'Ocean', img: 'https://images.pexels.com/photos/1854897/pexels-photo-1854897.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 8, title: 'High Five', sub: 'Connect', img: 'https://images.pexels.com/photos/3621184/pexels-photo-3621184.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 9, title: 'Trail Path', sub: 'Trail', img: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 10, title: 'Last Lap', sub: 'Finish', img: 'https://images.pexels.com/photos/1199590/pexels-photo-1199590.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 11, title: 'Dawn Crew', sub: 'Crew', img: 'https://images.pexels.com/photos/3621183/pexels-photo-3621183.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 12, title: 'Good Vibes', sub: 'Vibes', img: 'https://images.pexels.com/photos/1300526/pexels-photo-1300526.jpeg?auto=compress&cs=tinysrgb&w=800' },
]

export default function Gallery() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const gridWrapRef = useRef(null)
  const contentRef = useRef(null)
  const closeRef = useRef(null)
  // ✅ lazy initializer — no window access at module/render time (SSR safe)
  const stateRef = useRef(null)
  if (stateRef.current === null) {
    stateRef.current = {
      current: -1,
      isAnimating: false,
      allowTilt: true,
      scrollPos: 0,
      winsize: { width: 0, height: 0 },
    }
  }

  useEffect(() => {
    // Populate winsize now that we're in the browser
    stateRef.current.winsize = { width: window.innerWidth, height: window.innerHeight }

    const loadScript = (src) =>
      new Promise((res) => {
        if (document.querySelector(`script[src="${src}"]`)) return res()
        const s = document.createElement('script')
        s.src = src
        s.onload = res
        document.head.appendChild(s)
      })

    const init = async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js')
      await loadScript('https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js')
      await loadScript('https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js')

      // ✅ npm import instead of esm.sh (Turbopack-safe)
      const { default: charming } = await import('charming')

      setupGallery(charming)
    }

    const setupGallery = (charming) => {
      const { TweenMax, Expo, Elastic, Back, Quart, Quad } = window
      const Masonry = window.Masonry
      const imagesLoaded = window.imagesLoaded

      const state = stateRef.current
      const gridEl = gridRef.current
      const gridWrap = gridWrapRef.current
      const contentEl = contentRef.current
      const closeEl = closeRef.current

      const getOffset = (elem, axis) => {
        let offset = 0
        const type = axis === 'top' ? 'offsetTop' : 'offsetLeft'
        do { if (!isNaN(elem[type])) offset += elem[type] } while ((elem = elem.offsetParent))
        return offset
      }
      const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y)
      const getMousePos = (e) => {
        let posx = 0, posy = 0
        if (!e) e = window.event
        if (e.pageX || e.pageY) { posx = e.pageX; posy = e.pageY }
        else if (e.clientX || e.clientY) {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        }
        return { x: posx, y: posy }
      }
      const getAngle = (el) => {
        const tr = window.getComputedStyle(el, null).getPropertyValue('transform')
        let vals = tr.split('(')[1].split(')')[0].split(',')
        return Math.round(Math.asin(vals[1]) * (180 / Math.PI))
      }

      const preventDefault = (e) => { e = e || window.event; e.returnValue = false }
      const keys = { 37: 1, 38: 1, 39: 1, 40: 1 }
      const preventDefaultKeys = (e) => { if (keys[e.keyCode]) { preventDefault(e); return false } }
      const disableScroll = () => {
        window.addEventListener('DOMMouseScroll', preventDefault, false)
        window.onwheel = window.onmousewheel = document.onmousewheel = preventDefault
        window.ontouchmove = preventDefault
        document.onkeydown = preventDefaultKeys
      }
      const enableScroll = () => {
        window.removeEventListener('DOMMouseScroll', preventDefault, false)
        window.onmousewheel = document.onmousewheel = window.onwheel = window.ontouchmove = document.onkeydown = null
      }

      const getSizePosition = (el, scrolls = true) => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
        return {
          width: el.offsetWidth,
          height: el.offsetHeight,
          left: scrolls ? getOffset(el, 'left') - scrollLeft : getOffset(el, 'left'),
          top: scrolls ? getOffset(el, 'top') - scrollTop : getOffset(el, 'top'),
        }
      }

      class GridItem {
        constructor(el) {
          this.el = el
          this.bg = el.querySelector('.g-item-bg')
          this.imgWrap = el.querySelector('.g-item-wrap')
          this.imgEl = this.imgWrap.querySelector('img')
          this.titleEl = el.querySelector('.g-item-title')
          this.numberEl = el.querySelector('.g-item-number')

          charming(this.numberEl)
          this.numberLetters = this.numberEl.querySelectorAll('span')

          this.tiltconfig = {
            title: { translation: { x: [-8, 8], y: [4, -4] } },
            number: { translation: { x: [-5, 5], y: [-10, 10] } },
            img: { translation: { x: [-15, 15], y: [-10, 10] } },
          }
          this.tilt = { img: this.imgEl, title: this.titleEl, number: this.numberEl }
          this.angle = getAngle(this.imgEl)
          this.initEvents()
        }
        initEvents() {
          this.mouseenterFn = () => { if (!state.allowTilt) return; this.toggleHoverAnim('mouseenter') }
          this.mousemoveFn = (ev) => { if (!state.allowTilt) return; requestAnimationFrame(() => this.doTilt(ev)) }
          this.mouseleaveFn = () => { if (!state.allowTilt) return; this.resetTilt(); this.toggleHoverAnim('mouseleave') }
          this.el.addEventListener('mouseenter', this.mouseenterFn)
          this.el.addEventListener('mousemove', this.mousemoveFn)
          this.el.addEventListener('mouseleave', this.mouseleaveFn)
        }
        toggleHoverAnim(type) {
          TweenMax.to(this.bg, 1, { ease: Expo.easeOut, scale: type === 'mouseenter' ? 1.15 : 1 })
          this.numberLetters.forEach((letter, pos) => {
            TweenMax.to(letter, 0.2, {
              ease: Quad.easeIn, delay: pos * 0.1,
              y: type === 'mouseenter' ? '-50%' : '50%', opacity: 0,
              onComplete: () => {
                TweenMax.to(letter, type === 'mouseenter' ? 0.6 : 1, {
                  ease: type === 'mouseenter' ? Expo.easeOut : Elastic.easeOut.config(1, 0.4),
                  startAt: { y: type === 'mouseenter' ? '70%' : '-70%', opacity: 0 },
                  y: '0%', opacity: 1,
                })
              },
            })
          })
        }
        doTilt(ev) {
          const mousepos = getMousePos(ev)
          const scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft
          const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
          const bounds = this.el.getBoundingClientRect()
          const rel = { x: mousepos.x - bounds.left - scrollLeft, y: mousepos.y - bounds.top - scrollTop }
          for (let key in this.tilt) {
            const t = this.tiltconfig[key].translation
            TweenMax.to(this.tilt[key], 2, {
              ease: Expo.easeOut,
              x: (t.x[1] - t.x[0]) / bounds.width * rel.x + t.x[0],
              y: (t.y[1] - t.y[0]) / bounds.height * rel.y + t.y[0],
            })
          }
        }
        resetTilt() {
          for (let key in this.tilt)
            TweenMax.to(this.tilt[key], 2, { ease: Elastic.easeOut.config(1, 0.4), x: 0, y: 0 })
        }
        hide(anim = true) { this.toggle(anim, false) }
        show(anim = true) { this.toggle(anim, true) }
        toggle(anim, show) {
          TweenMax.to(this.imgEl, anim ? 0.8 : 0, {
            ease: Expo.easeInOut, delay: !anim ? 0 : show ? 0.15 : 0,
            scale: show ? 1 : 0, opacity: show ? 1 : 0,
          })
          TweenMax.to(this.bg, anim ? 0.8 : 0, {
            ease: Expo.easeInOut, delay: !anim ? 0 : show ? 0 : 0.15,
            scale: show ? 1 : 0, opacity: show ? 1 : 0,
          })
          this.toggleTexts(show ? 0.45 : 0, anim, show)
        }
        hideTexts(delay = 0, anim = true) { this.toggleTexts(delay, anim, false) }
        showTexts(delay = 0, anim = true) { this.toggleTexts(delay, anim, true) }
        toggleTexts(delay, anim, show) {
          TweenMax.to([this.titleEl, this.numberEl], !anim ? 0 : show ? 1 : 0.5, {
            ease: show ? Expo.easeOut : Quart.easeIn,
            delay: !anim ? 0 : delay,
            y: show ? 0 : 20, opacity: show ? 1 : 0,
          })
        }
      }

      class ContentItem {
        constructor(el) {
          this.el = el
          this.img = el.querySelector('.c-item-img')
          this.titleEl = el.querySelector('.c-item-title')
          charming(this.titleEl)
          this.letters = this.titleEl.querySelectorAll('span')
          this.total = this.letters.length
        }
        show(delay = 0, anim = true) { this.toggle(delay, anim, true) }
        hide(delay = 0, anim = true) { this.toggle(delay, anim, false) }
        toggle(delay, anim, show) {
          setTimeout(() => {
            this.letters.forEach((letter, pos) => {
              TweenMax.to(letter, !anim ? 0 : show ? 0.6 : 0.3, {
                ease: show ? Back.easeOut : Quart.easeIn,
                delay: !anim ? 0 : show ? pos * 0.05 : (this.total - pos - 1) * 0.04,
                startAt: show ? { y: '50%', opacity: 0 } : null,
                y: show ? '0%' : '50%', opacity: show ? 1 : 0,
              })
            })
          }, anim ? delay * 1000 : 0)
        }
      }

      const gridItems = Array.from(gridEl.querySelectorAll('.g-item')).map(el => new GridItem(el))
      const contentItems = Array.from(contentEl.querySelectorAll('.c-item')).map(el => new ContentItem(el))

      const sortByDist = (refPoint, arr) => {
        return arr
          .map(item => {
            const r = item.el.getBoundingClientRect()
            return { item, dist: distance(refPoint, { x: r.left + r.width / 2, y: r.top + r.height / 2 }) }
          })
          .sort((a, b) => a.dist - b.dist)
          .map(d => d.item)
      }

      const toggleAll = (exclude, anim, show) => {
        const rest = gridItems.filter(i => i !== exclude)
        if (!anim) {
          rest.forEach(i => i[show ? 'show' : 'hide'](false))
        } else {
          const r = exclude.el.getBoundingClientRect()
          const ref = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          sortByDist(ref, rest).forEach((item, pos) =>
            setTimeout(() => item[show ? 'show' : 'hide'](), show ? 300 + pos * 70 : pos * 70)
          )
        }
      }

      const showContentElems = (ci, delay, anim) => {
        TweenMax.to(closeEl, anim ? 1 : 0, {
          ease: Expo.easeOut, delay: anim ? delay : 0,
          startAt: { y: 60 }, y: 0, opacity: 1,
        })
        ci.show(delay, anim)
      }
      const hideContentElems = (ci, delay, anim) => {
        TweenMax.to(closeEl, anim ? 1 : 0, {
          ease: Expo.easeIn, delay: anim ? delay : 0,
          y: 60, opacity: 0,
        })
        ci.hide(delay, anim)
      }

      const openItem = (item) => {
        if (state.isAnimating) return
        state.isAnimating = true
        state.scrollPos = window.scrollY
        disableScroll()
        state.allowTilt = false

        state.current = gridItems.indexOf(item)
        toggleAll(item, true, false)
        item.hideTexts()
        item.el.style.zIndex = 1000

        const itemDim = getSizePosition(item.el)
        item.bg.style.cssText += `width:${itemDim.width}px;height:${itemDim.height}px;left:${itemDim.left}px;top:${itemDim.top}px;position:fixed;`

        const d = Math.hypot(state.winsize.width, state.winsize.height)
        TweenMax.to(item.bg, 1.2, {
          ease: Expo.easeInOut, delay: 0.4,
          x: state.winsize.width / 2 - (itemDim.left + itemDim.width / 2),
          y: state.winsize.height / 2 - (itemDim.top + itemDim.height / 2),
          scaleX: d / itemDim.width,
          scaleY: d / itemDim.height,
          rotation: -1 * item.angle * 2,
        })

        const ci = contentItems[state.current]
        ci.el.classList.add('c-item--current')

        const imgDim = getSizePosition(item.imgWrap)
        const cImgDim = getSizePosition(ci.img, false)
        showContentElems(ci, 1, true)

        TweenMax.to(item.imgEl, 1.2, {
          ease: Expo.easeInOut, delay: 0.55,
          scaleX: cImgDim.width / imgDim.width,
          scaleY: cImgDim.height / imgDim.height,
          x: (cImgDim.left + cImgDim.width / 2) - (imgDim.left + imgDim.width / 2),
          y: (cImgDim.top + cImgDim.height / 2) - (imgDim.top + imgDim.height / 2),
          rotation: 0,
          onComplete: () => {
            item.imgEl.style.opacity = 0
            ci.img.style.visibility = 'visible'
            gridWrap.classList.add('g-wrap--hidden')
            contentEl.style.pointerEvents = 'all'
            contentEl.style.position = 'fixed'
            window.scrollTo(0, 0)
            enableScroll()
            state.isAnimating = false
          },
        })
      }

      const closeItem = (anim = true) => {
        if (state.isAnimating) return
        state.isAnimating = true
        const ci = contentItems[state.current]
        const item = gridItems[state.current]

        window.scrollTo(0, state.scrollPos)
        ci.el.parentNode.style.position = 'fixed'
        disableScroll()
        gridWrap.classList.remove('g-wrap--hidden')

        hideContentElems(ci, 0, anim)
        item.imgEl.style.opacity = 1
        ci.img.style.visibility = 'hidden'

        TweenMax.to(item.imgEl, anim ? 1.2 : 0, {
          ease: Expo.easeInOut, scaleX: 1, scaleY: 1, x: 0, y: 0, rotation: item.angle * 2,
        })
        TweenMax.to(item.bg, anim ? 1.2 : 0, {
          ease: Expo.easeInOut, delay: 0.15,
          x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0,
          onComplete: () => {
            ci.el.classList.remove('c-item--current')
            item.bg.style.position = 'absolute'
            item.bg.style.left = '0px'
            item.bg.style.top = '0px'
            ci.el.parentNode.style.position = ''
            contentEl.style.pointerEvents = 'none'
            contentEl.style.position = 'fixed'
            state.current = -1
            state.allowTilt = true
            item.el.style.zIndex = 0
            enableScroll()
            state.isAnimating = false
          },
        })
        toggleAll(item, anim, true)
        item.showTexts(1, anim)
      }

      gridItems.forEach(item => {
        item.el.addEventListener('click', (ev) => { ev.preventDefault(); openItem(item) })
      })
      closeEl.addEventListener('click', () => closeItem())

      window.addEventListener('resize', () => {
        state.winsize = { width: window.innerWidth, height: window.innerHeight }
        if (state.current !== -1) closeItem(false)
      })

      imagesLoaded(gridEl.querySelectorAll('.g-item-img'), () => {
        new Masonry(gridEl, {
          itemSelector: '.g-item',
          columnWidth: 260,
          gutter: 24,
          fitWidth: true,
        })
        gridEl.style.opacity = '1'
      })
    }

    init()
  }, [])

  return (
    <section className="g-section" id="gallery" ref={sectionRef}>
      <div className="g-header">
        <h2 className="g-section-title">GALLERY</h2>
      </div>

      <div className="g-wrap" ref={gridWrapRef}>
        <div className="g-grid" ref={gridRef} style={{ opacity: 0 }}>
          {galleryItems.map((item, i) => (
            <a href="#" className="g-item" key={item.id}>
              <div className="g-item-bg" />
              <div className="g-item-wrap">
                <img
                  className="g-item-img"
                  src={item.img}
                  alt={item.title}
                  style={{ transform: `rotate3d(0,0,1,${i % 2 === 0 ? -4 : 4}deg)` }}
                />
              </div>
              <h3 className="g-item-title">{item.title}</h3>
              <h4 className="g-item-number">{item.sub}</h4>
            </a>
          ))}
        </div>
      </div>

      <div className="g-content" ref={contentRef}>
        {galleryItems.map((item) => (
          <div className="c-item" key={item.id}>
            <div className="c-item-intro">
              <img className="c-item-img" src={item.img} alt={item.title} />
              <h2 className="c-item-title">{item.title}</h2>
            </div>
          </div>
        ))}
        <button className="g-close" ref={closeRef}>Close</button>
      </div>
    </section>
  )
}