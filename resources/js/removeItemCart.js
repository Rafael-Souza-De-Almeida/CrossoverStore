document.addEventListener('DOMContentLoaded', () => {
  const delete_btns = document.querySelectorAll('#delete-item')

  delete_btns.forEach((delete_btn) => {
    const productId = delete_btn.getAttribute('data-product-id')

    const itemElement = delete_btn.closest('.cart-item')
    const subtotalElement = itemElement.querySelector('.item-subtotal')
    const totalElement = document.querySelector('#cart-total')

    delete_btn.addEventListener('click', async () => {
      try {
        const response = await fetch('/cart/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId,
          }),
        })
        const data = await response.json()

        if (response.ok) {
          const itemSubtotal = parseFloat(subtotalElement.textContent || 0)
          const currentTotal = parseFloat(totalElement.textContent || 0)
          const updatedTotal = currentTotal - itemSubtotal

          totalElement.textContent = updatedTotal.toFixed(2)

          itemElement.remove()
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert('Erro ao processar a requisição.')
      }
    })
  })
})
