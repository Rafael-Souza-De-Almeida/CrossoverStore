document.addEventListener('DOMContentLoaded', () => {
  const addCartButton = document.getElementById('add-cart')
  const productId = addCartButton.getAttribute('data-product-id')

  const quantityInput = document.getElementById('quantity-input')
  const decresaeBtn = document.getElementById('decrease-btn')
  const increaseBtn = document.getElementById('increase-btn')

  decresaeBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value, 10)
    if (currentQuantity > 1) {
      quantityInput.value = currentQuantity - 1
    }
  })

  increaseBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value, 10)
    quantityInput.value = currentQuantity + 1
  })

  addCartButton.addEventListener('click', async (e) => {
    e.preventDefault()

    const quantity = parseInt(quantityInput.value)
    if (isNaN(quantity) || quantity <= 0) {
      alert('Por favor, insira uma quantidade válida.')
      return
    }

    try {
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        alert('Produto Adicionado ao carrinho!')
      } else {
        alert(data.message)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message)
      } else {
        alert('Erro ao processar a requisição')
      }
    }
  })
})
