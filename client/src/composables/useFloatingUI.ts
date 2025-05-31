import { arrow, autoPlacement, autoUpdate, hide, flip, offset, shift, size, useFloating } from '@floating-ui/vue'
import { computed, ref } from 'vue'
import { getOppositePlacement, getSide } from '@floating-ui/utils'
import type { Side } from '@floating-ui/core'
import { refDebounced } from '@vueuse/core'

const rotations = {
  top: -135,
  right: -45,
  bottom: 45,
  left: 135,
}

const useFloatingUI = (target, floating, arrowRef, options) => {
  const { active, side, fitTargetWidth } = options,
    arrowSize = 16,
    minWidth = 32,
    minHeight = 32,
    maxDistanceToEdge = 16,
    offsetValue = arrowRef?.value ? arrowSize : 8,
    autoPlacementOptions = side ? { allowedPlacements: [side] } : {},
    shiftOptions = { padding: arrowSize },
    arrowOptions = { element: arrowRef, padding: arrowSize }

  /* Floating UI */
  const { floatingStyles, isPositioned, middlewareData } = useFloating(target, floating, {
    open: active,
    placement: side,
    strategy: 'fixed',
    middleware: [
      offset({ mainAxis: offsetValue }),
      autoPlacement(autoPlacementOptions),
      shift(shiftOptions),
      arrow(arrowOptions),
      size({
        apply({ availableWidth, availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${fitTargetWidth ? rects.reference.width : minWidth}px`,
            maxWidth: `${Math.max(minWidth, availableWidth - maxDistanceToEdge)}px`,
            maxHeight: `${Math.max(minHeight, availableHeight - maxDistanceToEdge)}px`,
          })
        },
      }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
  })

  /* Arrow */
  const arrowStyle = computed(() => {
    const side = getSide(middlewareData.value.offset?.placement ?? 'top'),
      staticSide = getOppositePlacement(side),
      rotation = rotations[side],
      middlewareArrow = middlewareData.value.arrow
    return {
      width: `${arrowSize}px`,
      height: `${arrowSize}px`,
      transform: `rotate(${rotation}deg)`,
      top: middlewareArrow?.y != null ? `${middlewareArrow?.y}px` : '',
      left: middlewareArrow?.x != null ? `${middlewareArrow?.x}px` : '',
      [staticSide]: `-${(arrowRef.value?.offsetWidth ?? 0) / 2}px`,
    }
  })

  return { floatingStyles, middlewareData, isPositioned, arrowStyle } 
}

export { useFloatingUI }
