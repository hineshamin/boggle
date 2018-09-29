let score = 0;
let time = 60;

$(document).ready(function() {
  $('#start-game').on('click', function(e) {
    timer();
    $('.hidden').removeClass('hidden');
  });
  $('#guess').on('click', function(e) {
    let guess = $('#word').val();
    $('#word').val('');
    $.post('/board', { guess }, function(res) {
      displayResult(userFacing(res.result));
      if (res.result == 'ok') {
        score += guess.length;
        displayScore(score);
      }
    });
  });
});

function userFacing(s) {
  return s
    .split('-')
    .map(c => c.charAt(0).toUpperCase() + c.substr(1))
    .join(' ');
}

function displayScore(score) {
  $('.score').empty();
  $('.score').append(`Score: ${score}`);
}

function displayResult(result) {
  $('.result').empty();
  $('.result').append($(`<h4>${result}</h4>`));
}

function timer() {
  let timerId = setInterval(function() {
    $('.timer').text(`Timer: ${time}`);
    if (time === 0) {
      clearInterval(timerId);
      alert('Game Over');
      $('#word').remove();
      $('#guess').remove();
      sendResults();
    }
    time--;
  }, 1000);
}

function sendResults() {
  $.post('/stats', { score }, function(res) {
    $('.high-score').text(`High Score: ${res.score}`);
    $('.games').text(`Games Played: ${res.times_played}`);
  });
}
