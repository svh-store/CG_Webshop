document.addEventListener('DOMContentLoaded', function() {
  var buttons = document.querySelectorAll('.bundle-products__add');
  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      var mainId = this.getAttribute('data-main');
      var compId = this.getAttribute('data-comp');
      if (!mainId || !compId) return;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            { id: parseInt(mainId), quantity: 1 },
            { id: parseInt(compId), quantity: 1 }
          ]
        })
      }).then(function() {
        window.location.href = '/cart';
      });
    });
  });
});
