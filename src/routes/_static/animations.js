export const FAVORITE_ANIMATION = [
  {
    properties: [{ transform: 'scale(1)' }, { transform: 'scale(2)' }, { transform: 'scale(1)' }],
    options: {
      duration: 333,
      easing: 'ease-in-out'
    }
  },
  {
    properties: [{ fill: 'var(--action-button-fill-color)' }, { fill: 'var(--action-button-fill-color-pressed)' }],
    options: {
      duration: 333,
      easing: 'linear'
    }
  }
]

export const TMM_ANIMATION = FAVORITE_ANIMATION
export const BOOKMARK_ANIMATION = FAVORITE_ANIMATION

export const SUBSCRIBE_BUTTON_ANIMATION = [
  {
    properties: [{ transform: 'scale(1)' }, { transform: 'scale(2)' }, { transform: 'scale(1)' }],
    options: {
      duration: 333,
      easing: 'ease-in-out'
    }
  }
]
