/* ===========================================================================
   feuillet.site behaviour

   Four small things, none of which the page depends on for its content:
   a theme toggle, scroll reveals, the notch panel's open and close, and the
   checkboxes. If this file never loads the page still reads; that is on
   purpose, since the reveals are the only thing hiding anything and they are
   released on load below as a fallback.
   ======================================================================== */
(function () {
  'use strict'

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* --- theme ------------------------------------------------------------
     Three states, not two: light, dark, and follow the machine. Cycling has
     to pass back through auto or a choice made once can never be undone.
     The key is the app's own, so a preference set here carries over. */
  var KEY = 'feuillet.theme'
  var root = document.documentElement

  function current() {
    return root.dataset.theme || 'auto'
  }

  function apply(next) {
    if (next === 'auto') {
      delete root.dataset.theme
      try { localStorage.removeItem(KEY) } catch (e) {}
    } else {
      root.dataset.theme = next
      try { localStorage.setItem(KEY, next) } catch (e) {}
    }
  }

  var toggle = document.getElementById('theme')
  if (toggle) {
    toggle.addEventListener('click', function () {
      var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      var now = current()
      // From auto, go to whichever the machine is not, so the first press
      // always visibly does something.
      if (now === 'auto') apply(systemDark ? 'light' : 'dark')
      else if (now === 'dark') apply('light')
      else apply('auto')
    })
  }

  /* --- the nav hairline, once you have left the top -------------------- */
  var nav = document.getElementById('nav')
  var onScroll = function () {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* --- reveals ----------------------------------------------------------
     One observer for everything that rises, plus the blocks that stage
     their own children (the week grid, the notification stack, the bars).
     Elements are given a stagger by their position within their section, so
     a row of three cards arrives as a row rather than as three events. */
  var staged = ['.rise', '#scatter', '.scatter-block', '#weekwrap', '#notes', '#gradecard', '#treeart', '.statement']
  var targets = document.querySelectorAll(staged.join(','))

  if (!('IntersectionObserver' in window) || reduced) {
    targets.forEach(function (el) { el.classList.add('in') })
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          var el = entry.target
          // Stagger only siblings that share a parent, so unrelated things
          // further down the page never inherit somebody else's delay.
          var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) {
            return n.classList && n.classList.contains('rise')
          })
          var i = sibs.indexOf(el)
          el.style.transitionDelay = i > 0 ? Math.min(i, 5) * 70 + 'ms' : '0ms'
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.08 }
    )
    targets.forEach(function (el) { io.observe(el) })

    // A backstop. A percentage rootMargin on a very tall window, a viewport
    // that never fires, a section skipped by an in-page jump: any of these
    // leaves something permanently invisible, which is a far worse failure
    // than an animation that did not play. After three seconds, whatever is
    // still hidden is simply shown.
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('in') })
    }, 3000)
  }

  /* --- the notch panel --------------------------------------------------
     Opening is staged in CSS: width first, height 100ms behind, which is
     what gives it the hinge. Closing is the genie, which warps the panel's
     own pixels rather than cropping its outline, so it has to be a separate
     class and it has to be cleared once it has run. */
  var notch = document.getElementById('notch')
  var notchBtn = document.getElementById('notch-toggle')
  var closeTimer = null

  function openNotch() {
    if (!notch) return
    clearTimeout(closeTimer)
    notch.classList.remove('is-closing')
    // Force a reflow so removing is-closing takes effect before is-open, or
    // the browser collapses the two into one frame and the genie's filter
    // is still on the way in.
    void notch.offsetWidth
    notch.classList.add('is-open')
    if (notchBtn) notchBtn.textContent = 'Close the panel'
  }

  function closeNotch() {
    if (!notch || !notch.classList.contains('is-open')) return
    notch.classList.add('is-closing')
    if (notchBtn) notchBtn.textContent = 'Open the panel'
    closeTimer = setTimeout(function () {
      notch.classList.remove('is-open')
      notch.classList.remove('is-closing')
    }, 260)
  }

  if (notchBtn) {
    notchBtn.addEventListener('click', function () {
      if (notch.classList.contains('is-open') && !notch.classList.contains('is-closing')) closeNotch()
      else openNotch()
    })
  }

  // It opens itself once, shortly after the page settles, because the whole
  // claim of the hero is that this thing comes out of the notch. Only once,
  // and never if it has already been driven by hand.
  if (notch && !reduced) {
    var touched = false
    if (notchBtn) notchBtn.addEventListener('click', function () { touched = true }, { once: true })
    setTimeout(function () { if (!touched) openNotch() }, 900)
  } else if (notch) {
    notch.classList.add('is-open')
    if (notchBtn) notchBtn.textContent = 'Close the panel'
  }

  /* --- ticking ----------------------------------------------------------
     The real behaviour: a tick is written immediately, the row stays where
     it is with a line through it, and it can be undone. Here that is the
     whole story, since there is nothing behind the page to write to. The
     leaf is the same blade the wordmark is dotted with. */
  function sprout(row) {
    var box = row.querySelector('.box')
    if (!box) return
    var r = box.getBoundingClientRect()
    // Fixed to the viewport and appended to the body, rather than positioned
    // inside the row. The panel clips its own content, so a leaf parented
    // anywhere inside it would be cut off on the way up, and hunting for an
    // offsetParent means quietly making somebody else's element relative.
    var leaf = document.createElement('span')
    leaf.className = 'leaf-pop'
    leaf.setAttribute('aria-hidden', 'true')
    leaf.style.left = r.left + r.width / 2 - 5 + 'px'
    leaf.style.top = r.top - 4 + 'px'
    leaf.innerHTML = '<svg width="10" height="18" viewBox="0 0 130 240"><use href="#leaf"/></svg>'
    document.body.appendChild(leaf)
    setTimeout(function () { leaf.remove() }, 950)
  }

  document.querySelectorAll('[data-tick]').forEach(function (row) {
    row.setAttribute('role', 'checkbox')
    row.setAttribute('tabindex', '0')
    row.setAttribute('aria-checked', 'false')

    function flip() {
      var done = row.classList.toggle('done')
      row.setAttribute('aria-checked', done ? 'true' : 'false')
      if (done && !reduced) sprout(row)
    }

    row.addEventListener('click', flip)
    row.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        flip()
      }
    })
  })
})()
