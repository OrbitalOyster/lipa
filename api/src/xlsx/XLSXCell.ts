import type {
  Cell,
} from 'exceljs'

class XLSXCell {
  constructor(cell: Cell) {
    this.type = cell.model.type
    this.address = cell.address,
    this.style = cell.model.style,
    this.value = cell.value,
    this.borders = this.parseBorders(cell)
  }

  private parseBorders(cell: Cell) {
    const style = cell.style
    if (!style.border)
      return false
    if (
      !style.border.top &&
      !style.border.right &&
      !style.border.bottom &&
      !style.border.left
    )
      return false
    return {
      top: style.border.top || false,
      right: style.border.right || false,
      bottom: style.border.bottom || false,
      left: style.border.left || false,
    }
  }

  isTopRightCorner() {
    return this.borders && this.borders.top && this.borders.right
  }
}

export { XLSXCell }
