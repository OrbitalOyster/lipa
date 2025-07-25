import { arrow as arrowMiddleware, autoPlacement, autoUpdate, hide, offset, shift, size, useFloating } from '@floating-ui/vue'
import { getOppositePlacement, getSide } from '@floating-ui/utils'
import type { Ref } from 'vue'
import { computed } from 'vue'

const arrowAngles = {
  top: -135,
  right: -45,
  bottom: 45,
  left: 135,
}

const useFloatingUI = (target: Ref<HTMLElement | null>, floating: Ref<HTMLElement | null>, arrow: Ref<HTMLElement | null> | null, options: FloatingUIOptions) => {
  const { active, side, fitTargetWidth, useArrow } = options,
    arrowSize = 16,
    minWidth = 32,
    minHeight = 32,
    maxDistanceToEdge = 16,
    offsetValue = useArrow ? arrowSize : 8,
    autoPlacementOptions = side ? { allowedPlacements: [side] } : {},
    shiftOptions = { padding: arrowSize },
    arrowOptions = { element: arrow, padding: arrowSize }

  /* Floating UI */
  const { floatingStyles, isPositioned, middlewareData } = useFloating(target, floating, {
    open: active,
    placement: side,
    strategy: 'fixed',
    middleware: [
      offset({ mainAxis: offsetValue }),
      autoPlacement(autoPlacementOptions),
      shift(shiftOptions),
      arrowMiddleware(arrowOptions),
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
  const arrowStyle = arrow
    ? computed(() => {
        const side = getSide(middlewareData.value.offset?.placement ?? 'top'),
          staticSide = getOppositePlacement(side),
          angle = arrowAngles[side],
          middlewareArrow = middlewareData.value.arrow
        return {
          width: `${arrowSize}px`,
          height: `${arrowSize}px`,
          transform: `rotate(${angle}deg)`,
          top: middlewareArrow?.y != null ? `${middlewareArrow?.y}px` : '',
          left: middlewareArrow?.x != null ? `${middlewareArrow?.x}px` : '',
          [staticSide]: `-${(arrow.value?.offsetWidth ?? 0) / 2}px`,
        }
      })
    : null

  return { floatingStyles, middlewareData, isPositioned, arrowStyle }
}

export { useFloatingUI }
