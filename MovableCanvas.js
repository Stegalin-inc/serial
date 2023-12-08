class Movable {
      ctx = null
      last = [0, 0]
      redraw = null
      zoom = 1
      translate = [0, 0]

      constructor(canvas, ctx, redraw) {
        this.ctx = ctx
        this.redraw = redraw
        canvas.onmousedown = this.onmousedown.bind(this)
        canvas.onmousemove = this.onmousemove.bind(this)
        canvas.onmouseup = this.onmouseup.bind(this)
        canvas.onwheel = this.onwheel.bind(this)
        canvas.onclick = this.onclick.bind(this)

      }

      onDrag(dx, dy) {
        const z = this.zoom
        this.ctx.translate((dx) / z, (dy) / z)
        this.translate = [this.translate[0] + (dx) / z, this.translate[1] + (dy) / z]
        this.redraw()
      }

      /**
       * @argument {MouseEvent} e
       */
      onmousedown(e) {
        this.moving = true;
        this.last = [e.offsetX, e.offsetY]
      }

      onmousemove(e) {
        if (!this.moving) return;

        const [lx, ly] = this.last
        const [nx, ny] = [e.offsetX, e.offsetY]
        this.onDrag((nx - lx), (ny - ly))
        this.last = [nx, ny]
      }

      onmouseup(e) {
        this.moving = false;
      }

      /**
       * @argument {WheelEvent} e
       */
      onwheel(e) {
        const factor = e.deltaY < 0 ? 1.1 : 0.9
        this.zoom *= factor
        const [tx, ty] = this.translate
        const [mx, my] = [e.offsetX, e.offsetY]
        const [x, y] = this.getWorldCoord(mx, my)

        this.ctx.translate(x, y)
        this.ctx.scale(factor, factor)
        this.ctx.translate(-x, -y)

        this.redraw()
      }

      getWorldCoord(x, y) {
        var matrix = this.ctx.getTransform();
        var imatrix = matrix.invertSelf();
        var xx = x * imatrix.a + y * imatrix.c + imatrix.e;
        var yy = x * imatrix.b + y * imatrix.d + imatrix.f;
        return [xx, yy]
      }
      onclick(e) {
        const [x, y] = [e.offsetX, e.offsetY]

      }
    }

// export_descr_unit_parse
function export_descr_unit_parse(descr) {
  return descr
    .split('\n')
    .map((x) => x.replace(/;.*/, '').trim())
    .filter(Boolean)
    .map((x) => x.split(/[ ]+/))
    .reduce((units, [prop, ...val]) => {
      if (prop === 'type') units.push({});
      const last = units.at(-1);
      last[prop] = val;
      return units;
    }, []);
}


function export_descr_unit_parse_2(descr) {
  return descr
    .split('\n')
    .map((x) => x.replace(/;.*/, '').trim())
    .filter(Boolean)
    .map((x) => x.replace(/[ ]+/, '@#$').split('@#$'))
    .reduce((units, [prop, val]) => {
      if (prop === 'type') units.push({})
      const last = units.at(-1)
      last[prop] = val
        .split(',')
        .map((x) => x.trim())
        .map((x) => (Number.isNaN(+x) ? x : +x))
      last[prop] = last[prop].length === 1 ? last[prop][0] : last[prop]
      return units
    }, [])
}
