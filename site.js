/* ===========================================================================
   feuillet.site behaviour

   Nothing here is required for the page to read. Hidden states are scoped
   under .js, which is set as the first thing this file does, so a visitor who
   never runs it sees every section in its finished state instead of a blank
   one. Every loop stops when its section leaves the screen.
   ======================================================================== */
(function () {
  'use strict'

  var root = document.documentElement
  root.classList.add('js')

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var canHover = window.matchMedia('(hover: hover)').matches
  var french = document.documentElement.lang === 'fr'

  /* --- theme toggle (Nocturne / Parchment) -------------------------------- */
  function updateThemeIcons(isLight) {
    document.querySelectorAll('.nav-theme-btn').forEach(function (btn) {
      btn.innerHTML = isLight
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
      var title = isLight ? (french ? 'Passer au mode Nocturne' : 'Switch to Nocturne theme') : (french ? 'Passer au mode Parchemin' : 'Switch to Parchment theme')
      btn.setAttribute('title', title)
      btn.setAttribute('aria-label', title)
    })
  }

  var currentTheme = 'dark'
  try { currentTheme = localStorage.getItem('feuillet.theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') } catch {}
  if (currentTheme === 'light') { root.dataset.theme = 'light' }
  updateThemeIcons(root.dataset.theme === 'light')

  document.querySelectorAll('.nav-theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isLight = root.dataset.theme !== 'light'
      root.dataset.theme = isLight ? 'light' : 'dark'
      try { localStorage.setItem('feuillet.theme', root.dataset.theme) } catch {}
      updateThemeIcons(isLight)
    })
  })

  /* --- first-party, cookie-free measurement ------------------------------
     Only an allow-listed event name, the page path and page language leave
     the browser. Global Privacy Control and Do Not Track are respected. */
  var privacySignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1'
  function track(name) {
    if (privacySignal || !name) return
    var payload = JSON.stringify({ event: name, path: location.pathname, lang: document.documentElement.lang || 'en' })
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/event', new Blob([payload], { type: 'application/json' }))
      } else {
        fetch('/api/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true })
      }
    } catch {}
  }
  document.querySelectorAll('[data-event]').forEach(function (el) {
    el.addEventListener('click', function () { track(el.getAttribute('data-event')) })
  })

  /* Plays `fn` the first time `el` is on screen, then forgets about it. */
  function once(el, fn, threshold) {
    if (!el) return
    if (reduced) { fn(); return }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        seen.disconnect()
        fn()
      })
    }, { threshold: threshold || 0.3 })
    seen.observe(el)
  }

  /* Runs `fn(true)` and `fn(false)` as `el` enters and leaves. */
  function whileSeen(el, fn, threshold) {
    if (!el) return
    if (reduced) { fn(true); return }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { fn(entry.isIntersecting) })
    }, { threshold: threshold || 0.15 })
    obs.observe(el)
  }

  /* --- headings arrive a word at a time ---------------------------------- */
  document.querySelectorAll('.words').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/)
    el.textContent = ''
    words.forEach(function (word, i) {
      var span = document.createElement('span')
      span.className = 'w'
      span.textContent = word
      span.style.transitionDelay = (i * 55) + 'ms'
      el.appendChild(span)
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '))
    })
  })

  /* --- reveals & bento cards ---------------------------------------------- */
  if (reduced) {
    document.querySelectorAll('.reveal, .words, .bento-card, .bento-grid').forEach(function (el) { el.classList.add('on') })
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        var el = entry.target
        el.classList.add('on')
        el.querySelectorAll('.reveal').forEach(function (kid, i) {
          kid.style.transitionDelay = (i * 70) + 'ms'
          kid.classList.add('on')
        })
        el.querySelectorAll('.bento-card').forEach(function (card, i) {
          card.style.setProperty('--delay', i)
          card.classList.add('on')
        })
        io.unobserve(el)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 })
    document.querySelectorAll('section, .reveal, .words, .bento-grid, .bento-card').forEach(function (el) { io.observe(el) })
  }

  /* Attio-style dynamic border glow tracking */
  if (canHover && !reduced) {
    document.querySelectorAll('.bento-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect()
        var x = e.clientX - rect.left
        var y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', x + 'px')
        card.style.setProperty('--mouse-y', y + 'px')
      })
    })
  }

  /* --- counters ------------------------------------------------------------
     Comma decimals, because every number on this site is French. */
  function countTo(el, to, decimals, suffix, duration) {
    var from = parseFloat(String(el.textContent).replace(',', '.').replace(/[^0-9.-]/g, '')) || 0
    var start = null
    var dur = duration || 520
    function frame(t) {
      if (start === null) start = t
      var p = Math.min(1, (t - start) / dur)
      var eased = 1 - Math.pow(1 - p, 3)
      var v = (from + (to - from) * eased).toFixed(decimals).replace('.', ',')
      el.textContent = v + (suffix || '')
      if (p < 1) requestAnimationFrame(frame)
    }
    if (reduced) { el.textContent = to.toFixed(decimals).replace('.', ',') + (suffix || ''); return }
    requestAnimationFrame(frame)
  }

  /* --- the app window: entrance, then a tilt toward the pointer ----------- */
  var appwin = document.querySelector('.appwin')
  if (appwin) {
    var rows = appwin.querySelectorAll('.check-row')
    rows.forEach(function (row, i) { row.style.transitionDelay = (280 + i * 90) + 'ms' })
    setTimeout(function () { appwin.classList.add('on') }, 120)

    if (canHover && !reduced) {
      var tilt = appwin.closest('.tilt') || appwin.parentElement
      tilt.addEventListener('pointermove', function (e) {
        var r = tilt.getBoundingClientRect()
        var x = (e.clientX - r.left) / r.width - 0.5
        var y = (e.clientY - r.top) / r.height - 0.5
        appwin.style.transform = 'rotateY(' + (x * 4).toFixed(2) + 'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg) translateZ(0)'
      })
      tilt.addEventListener('pointerleave', function () { appwin.style.transform = '' })
    }
  }

  /* --- the flow: wires draw once, pulses loop while it is watched --------- */
  var flow = document.getElementById('flow')
  if (flow) {
    flow.querySelectorAll('.wire').forEach(function (w) { w.setAttribute('pathLength', '1') })
    flow.querySelectorAll('.fnode').forEach(function (n, i) { n.style.transitionDelay = (120 + i * 70) + 'ms' })
    once(flow, function () { flow.classList.add('in') }, 0.2)
    var pulses = flow.querySelectorAll('.pulse')
    function randomizePulses() {
      pulses.forEach(function (pulse) {
        var outgoing = pulse.classList.contains('back')
        var duration = (outgoing ? 1.35 : 1.55) + Math.random() * (outgoing ? 1.05 : 1.25)
        pulse.style.animationDuration = duration.toFixed(2) + 's'
        pulse.style.animationDelay = (-Math.random() * duration).toFixed(2) + 's'
      })
    }
    randomizePulses()
    whileSeen(flow, function (visible) {
      if (visible) randomizePulses()
      flow.classList.toggle('live', visible)
    }, 0.15)

    /* A node lights as its own pulse reaches the middle, so the diagram reads
       as traffic arriving rather than as ten things blinking together. */
    if (!reduced) {
      var lit = null
      var sources = Array.prototype.slice.call(flow.querySelectorAll('.fnode[data-in]'))
      var last = -1
      function lightRandomSource() {
        sources.forEach(function (n) { n.classList.remove('lit') })
        if (!sources.length) return
        var next = Math.floor(Math.random() * sources.length)
        if (sources.length > 1 && next === last) next = (next + 1 + Math.floor(Math.random() * (sources.length - 1))) % sources.length
        sources[next].classList.add('lit')
        last = next
        lit = setTimeout(lightRandomSource, 260 + Math.random() * 430)
      }
      whileSeen(flow, function (visible) {
        if (!visible) { if (lit) { clearTimeout(lit); lit = null }; return }
        if (lit) return
        lightRandomSource()
      }, 0.15)
    }
  }

  /* --- the week fills in --------------------------------------------------- */
  var weekcard = document.querySelector('.weekcard')
  if (weekcard) {
    weekcard.querySelectorAll('.course, .item').forEach(function (el, i) {
      el.style.transitionDelay = (120 + i * 85) + 'ms'
    })
    once(weekcard, function () { weekcard.classList.add('in') }, 0.25)
  }

  /* --- ticks feed the sapling ---------------------------------------------- */
  var sapling = document.getElementById('sapling')
  var sapCount = document.getElementById('sapcount')
  var leaves = 0
  try { leaves = parseInt(sessionStorage.getItem('feuillet.site.leaves') || '0', 10) || 0 } catch {}

  function paintSapling() {
    if (!sapling) return
    var slots = sapling.querySelectorAll('.slf')
    slots.forEach(function (slot, i) { slot.classList.toggle('on', i < Math.min(leaves, slots.length)) })
    if (sapCount) sapCount.textContent = String(leaves)
    sapling.classList.toggle('has', leaves > 0)
  }

  function flyLeaf(from) {
    leaves += 1
    try { sessionStorage.setItem('feuillet.site.leaves', String(leaves)) } catch {}
    paintSapling()
    if (reduced || !from || !sapling) return
    var target = sapling.getBoundingClientRect()
    var fly = document.createElement('span')
    fly.className = 'leaf-fly'
    fly.innerHTML = '<svg width="11" height="16" viewBox="0 0 512 512"><use href="#leaf"/></svg>'
    fly.style.left = (from.left + from.width / 2 - 5) + 'px'
    fly.style.top = (from.top - 4) + 'px'
    document.body.appendChild(fly)
    var dx = target.left + target.width / 2 - (from.left + from.width / 2)
    var dy = target.top + target.height * 0.5 - (from.top - 4)
    fly.animate([
      { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.5 + 'px,' + (dy * 0.5 - 44) + 'px) rotate(140deg) scale(0.95)', opacity: 1, offset: 0.55 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(300deg) scale(0.45)', opacity: 0.15 }
    ], { duration: 820, easing: 'cubic-bezier(0.3,0.7,0.3,1)' }).onfinish = function () { fly.remove() }
  }

  /* --- ink becomes tasks ---------------------------------------------------
     Armed while it is still below the fold, so an arriving visitor sees the
     empty page and then the scan, never the finished page first. */
  var capture = document.getElementById('capture')
  if (capture) {
    var scanzone = capture.querySelector('.scanzone')
    var ocrBoxes = capture.querySelectorAll('.ocr-box')

    function updateLaser(pct) {
      if (scanzone) scanzone.style.setProperty('--beam-x', pct.toFixed(1) + '%')
      ocrBoxes.forEach(function (box) {
        var min = parseFloat(box.getAttribute('data-left') || '0')
        var max = parseFloat(box.getAttribute('data-right') || '100')
        box.classList.toggle('active', pct >= min && pct <= max)
      })
    }

    if (scanzone && !reduced) {
      var scrubLaser = function (e) {
        var r = scanzone.getBoundingClientRect()
        var p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
        updateLaser(p * 100)
      }
      scanzone.addEventListener('pointermove', scrubLaser)
      scanzone.addEventListener('pointerdown', scrubLaser)
    }



    var arm = function () {
      capture.classList.remove('playing', 'done')
      capture.classList.add('armed')
      void capture.offsetWidth
    }
    var play = function () {
      if (reduced) { capture.classList.add('done'); return }
      arm()
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          capture.classList.remove('armed')
          capture.classList.add('playing')
          capture.querySelectorAll('.spread .ink path').forEach(function (p, i) {
            p.style.transitionDelay = (140 + i * 200) + 'ms'
          })
          setTimeout(function () {
            capture.classList.add('done')
            updateLaser(38)
            capture.querySelectorAll('.draft').forEach(function (d, i) { d.style.transitionDelay = (i * 130) + 'ms' })
          }, 1450)
        })
      })
    }
    if (!reduced) arm()
    once(capture, function () { setTimeout(play, 220) }, 0.35)
  }

  /* --- the deadline that ages ---------------------------------------------
     The whole eight-to-sixteen-day run takes about five seconds. Nobody stays
     on one section long enough to watch a slower one reach its point. */
  var aging = document.getElementById('aging')
  if (aging) {
    var daysEl = document.getElementById('aging-days')
    var nudge = document.getElementById('aging-nudge')
    var nudgeText = document.getElementById('aging-nudge-text')
    var day = 8
    var timer = null

    function render() {
      daysEl.textContent = String(day)
      aging.classList.toggle('warm', day >= 11 && day < 14)
      aging.classList.toggle('hot', day >= 14)
      nudge.classList.toggle('on', day >= 10 && day !== 12 && day <= 15)
      if (day === 10) nudgeText.textContent = 'Toujours pas commencé.'
      if (day >= 13) nudgeText.textContent = "Deuxième rappel. L'écart se creuse."
    }
    function schedule() { timer = setTimeout(tick, day < 11 ? 420 : day < 14 ? 560 : 700) }
    function tick() { day = day > 15 ? 8 : day + 1; render(); schedule() }

    whileSeen(aging, function (visible) {
      clearTimeout(timer)
      if (!visible || reduced) { if (reduced) { day = 14; render() } return }
      day = 8
      render()
      schedule()
    }, 0.3)
  }

  /* --- the grades card cycles through the term -----------------------------
     Three étapes, the same four courses, re-drawn in place. A single frozen
     card cannot show the one thing this feature is for: the movement between
     one report and the next. */
  var gradecard = document.getElementById('gradecard')
  if (gradecard) {
    var ETAPES = [
      {
        name: 'Étape 1', avg: 76.4, delta: 'Physique 12 pts', dir: 'down',
        courses: [
          { nm: 'Math', you: 82, cls: 84 },
          { nm: 'Anglais', you: 78, cls: 81 },
          { nm: 'Chimie', you: 75, cls: 79 },
          { nm: 'Physique', you: 68, cls: 80 }
        ]
      },
      {
        name: 'Étape 2', avg: 84.9, delta: 'Physique 13 pts', dir: 'up',
        courses: [
          { nm: 'Math', you: 88, cls: 83 },
          { nm: 'Anglais', you: 87, cls: 82 },
          { nm: 'Chimie', you: 83, cls: 80 },
          { nm: 'Physique', you: 81, cls: 79 }
        ]
      },
      {
        name: 'Étape 3', avg: 92.3, delta: 'Math 8 pts', dir: 'up',
        courses: [
          { nm: 'Math', you: 96, cls: 86 },
          { nm: 'Anglais', you: 94, cls: 84 },
          { nm: 'Chimie', you: 91, cls: 82 },
          { nm: 'Physique', you: 88, cls: 81 }
        ]
      }
    ]

    var bars = gradecard.querySelectorAll('.bar')
    var etapeEl = gradecard.querySelector('.etape')
    var avgEl = gradecard.querySelector('.gc-avg-val')
    var deltaEl = gradecard.querySelector('.gc-delta')
    var stepsEl = gradecard.querySelectorAll('.gc-step')
    var hint = document.getElementById('gcHint')
    var scrub = document.getElementById('gcScrub')
    var at = 0
    var loop = null
    var driven = false

    function gradeFrame(pos) {
      var lo = Math.max(0, Math.min(ETAPES.length - 1, Math.floor(pos)))
      var hi = Math.max(0, Math.min(ETAPES.length - 1, Math.ceil(pos)))
      var t = pos - lo
      var a = ETAPES[lo]
      var b = ETAPES[hi]
      var mix = function (x, y) { return x + (y - x) * t }
      return {
        name: t < 0.5 ? a.name : b.name,
        avg: mix(a.avg, b.avg),
        delta: t < 0.5 ? a.delta : b.delta,
        dir: t < 0.5 ? a.dir : b.dir,
        index: t < 0.5 ? lo : hi,
        courses: a.courses.map(function (c, i) {
          return { nm: c.nm, you: mix(c.you, b.courses[i].you), cls: mix(c.cls, b.courses[i].cls) }
        })
      }
    }

    function paint(pos, animateNumbers) {
      var e = gradeFrame(pos)
      var previousAvg = parseFloat(String(avgEl.textContent).replace(',', '.').replace(/[^0-9.-]/g, '')) || e.avg
      etapeEl.textContent = e.name
      if (animateNumbers) countTo(avgEl, e.avg, 1, ' %', 260)
      else avgEl.textContent = e.avg.toFixed(1).replace('.', ',') + ' %'

      if (animateNumbers && Math.abs(previousAvg - e.avg) > 0.05) {
        clearTimeout(gradecard._gradePulse)
        gradecard.classList.remove('grade-drop', 'grade-rise')
        void gradecard.offsetWidth
        gradecard.classList.add(e.avg < previousAvg ? 'grade-drop' : 'grade-rise')
        gradecard._gradePulse = setTimeout(function () { gradecard.classList.remove('grade-drop', 'grade-rise') }, 620)
      }

      var text = (e.dir === 'up' ? '↑ ' : '↓ ') + e.delta
      if (deltaEl.textContent !== text) {
        deltaEl.classList.add('swap')
        setTimeout(function () {
          deltaEl.textContent = text
          deltaEl.classList.toggle('up', e.dir === 'up')
          deltaEl.classList.remove('swap')
        }, animateNumbers ? 80 : 0)
      }
      stepsEl.forEach(function (s, i) { s.classList.toggle('on', i === e.index) })

      bars.forEach(function (bar, i) {
        var c = e.courses[i]
        var col = bar.querySelector('.col')
        var avgLine = bar.querySelector('.bar-avg')
        var val = bar.querySelector('.val')
        var previous = parseFloat(bar.dataset.value || String(c.you))
        /* Below the class average is the one state the app raises by itself,
           so it is the one state that changes colour. */
        bar.classList.toggle('low', c.you < c.cls)
        col.style.height = c.you.toFixed(1) + '%'
        avgLine.style.bottom = c.cls.toFixed(1) + '%'
        avgLine.setAttribute('data-avg', String(Math.round(c.cls)))
        bar.querySelector('.nm').textContent = c.nm
        bar.dataset.value = c.you.toFixed(1)
        if (animateNumbers && previous !== c.you) {
          clearTimeout(bar._moveTimer)
          bar.classList.remove('move-up', 'move-down')
          void bar.offsetWidth
          bar.classList.add(c.you > previous ? 'move-up' : 'move-down')
          bar._moveTimer = setTimeout(function () { bar.classList.remove('move-up', 'move-down') }, 480)
        }
        if (animateNumbers) countTo(val, c.you, 0, '', 220)
        else val.textContent = String(Math.round(c.you))
      })
    }

    bars.forEach(function (bar, i) { bar.querySelector('.col').style.transitionDelay = (i * 110) + 'ms' })
    paint(0, false)
    once(gradecard, function () {
      gradecard.classList.add('in')
      setTimeout(function () {
        bars.forEach(function (bar, i) { bar.querySelector('.col').style.transitionDelay = (i * 18) + 'ms' })
      }, 720)
      paint(0, true)
    }, 0.3)

    function stopGradeAuto() {
      clearTimeout(loop)
      loop = null
      driven = true
      if (hint) hint.classList.add('gone')
    }

    function scheduleGradeAuto() {
      loop = setTimeout(function () {
        at = (at + 1) % ETAPES.length
        paint(at, true)
        scheduleGradeAuto()
      }, 2000 + Math.random() * 1000)
    }

    whileSeen(gradecard, function (visible) {
      clearTimeout(loop)
      loop = null
      if (!visible || reduced || driven) return
      scheduleGradeAuto()
    }, 0.35)

    stepsEl.forEach(function (step, i) {
      step.addEventListener('click', function () {
        stopGradeAuto()
        at = i
        paint(i, true)
      })
    })

    if (scrub && !reduced) {
      var dragging = false
      var gradePosition = function (e) {
        var r = scrub.getBoundingClientRect()
        var p = (e.clientX - r.left) / r.width
        return Math.max(0, Math.min(1, p)) * (ETAPES.length - 1)
      }
      scrub.addEventListener('pointerdown', function (e) {
        dragging = true
        scrub.setPointerCapture(e.pointerId)
        stopGradeAuto()
        paint(gradePosition(e), false)
      })
      scrub.addEventListener('pointermove', function (e) {
        if (dragging) paint(gradePosition(e), false)
      })
      var releaseGrade = function (e) {
        if (!dragging) return
        dragging = false
        at = Math.round(gradePosition(e))
        paint(at, true)
      }
      scrub.addEventListener('pointerup', releaseGrade)
      scrub.addEventListener('pointercancel', releaseGrade)
    }

  }

  /* --- the notch ----------------------------------------------------------- */
  var notch = document.getElementById('notch')
  if (notch) {
    if (reduced) {
      notch.classList.add('is-open')
    } else {
      var held = false
      var beat = null
      notch.addEventListener('pointerenter', function () { held = true; notch.classList.add('is-open') })
      notch.addEventListener('pointerleave', function () { held = false })
      whileSeen(document.getElementById('stage'), function (visible) {
        clearInterval(beat)
        if (!visible) return
        setTimeout(function () { notch.classList.add('is-open') }, 260)
        beat = setInterval(function () {
          if (!held) notch.classList.toggle('is-open')
        }, 5200)
      }, 0.3)
    }
  }

  /* --- ticks feed the sapling ---------------------------------------------- */
  document.querySelectorAll('[data-tick]').forEach(function (row) {
    var box = row.querySelector('[data-box]') || row.querySelector('.box')
    if (!box) return
    var tick = function (e) {
      if (e) e.stopPropagation()
      var done = row.classList.toggle('done')
      box.setAttribute('aria-checked', done ? 'true' : 'false')
      if (!done) return
      flyLeaf(box.getBoundingClientRect())
    }
    box.addEventListener('click', tick)
    box.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tick() }
    })
  })
  paintSapling()

  /* --- tiles & cards light where the cursor is ---------------------------- */
  if (canHover && !reduced) {
    document.addEventListener('pointermove', function (e) {
      var tile = e.target.closest ? e.target.closest('.tile, .appwin, .live-frame, .attention-card, .close-band, .notch-shell, .split-col') : null
      if (tile === null) return
      var r = tile.getBoundingClientRect()
      tile.style.setProperty('--mx', (e.clientX - r.left) + 'px')
      tile.style.setProperty('--my', (e.clientY - r.top) + 'px')
    }, { passive: true })

    /* The main calls to action lean toward the pointer as it approaches. */
    document.querySelectorAll('.btn-primary, .pilot-target').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect()
        var x = (e.clientX - r.left - r.width / 2) / r.width
        var y = (e.clientY - r.top - r.height / 2) / r.height
        btn.style.transform = 'translate(' + (x * 7).toFixed(1) + 'px,' + (y * 5).toFixed(1) + 'px)'
      })
      btn.addEventListener('pointerleave', function () { btn.style.transform = '' })
    })
  }

  /* --- the ring motif drifts against the scroll ---------------------------- */
  var orbs = document.querySelectorAll('.orb[data-drift]')
  if (orbs.length > 0 && !reduced) {
    var ticking = false
    var place = function () {
      var y = window.scrollY
      orbs.forEach(function (orb) {
        var centred = orb.dataset.centred === '1'
        orb.style.transform = (centred ? 'translateX(-50%) ' : '') +
          'translateY(' + (y * parseFloat(orb.dataset.drift)).toFixed(1) + 'px)'
      })
      ticking = false
    }
    window.addEventListener('scroll', function () {
      if (ticking) return
      ticking = true
      requestAnimationFrame(place)
    }, { passive: true })
    place()
  }

  /* --- the pilot request ---------------------------------------------------
     Posts to the function when one is configured. When it is not, the details
     are handed to a mail client rather than swallowed: a form that silently
     loses a school's request is worse than no form. */
  var form = document.getElementById('pilotForm')
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      track('pilot_submit')
      var data = {}
      new FormData(form).forEach(function (v, k) { data[k] = v })
      var sent = document.getElementById('sent')
      var button = form.querySelector('button[type=submit]')
      button.disabled = true

      fetch('/api/pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status))
        sent.hidden = false
        sent.textContent = french ? 'Envoyé. Réponse sous deux jours.' : 'Sent. Expect a reply within two days.'
        form.reset()
      }).catch(function () {
        var body = Object.keys(data).map(function (k) { return k + ': ' + data[k] }).join('\n')
        window.location.href = 'mailto:brebeufusages@gmail.com?subject=' +
          encodeURIComponent('Feuillet school pilot') + '&body=' + encodeURIComponent(body)
        sent.hidden = false
        sent.textContent = french ? 'Ouverture de votre messagerie.' : 'Opening your email application.'
      }).then(function () { button.disabled = false })
    })
  }
})()
