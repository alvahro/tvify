/**
 * Module Dependencies
 */

import $ from 'jquery'
import socketio from 'socket.io-client'

let socket = socketio()
socket.emit('ping')

let $tvShowsContainer = $('#app-body').find('.tv-shows')

$tvShowsContainer.on('click', 'button.like', function (ev) {
  let $this = $(this)
  let $article = $this.closest('.tv-show')
  let id = $article.data('id')
  $.post('/api/vote/' + id, function () {
    let counter = $this.closest('article').find('.count')
    let content = counter.html()
    let count = Number(content)
    count = count + 1
    counter.html(count)
    $article.toggleClass('liked')
  })
})

export default $tvShowsContainer
