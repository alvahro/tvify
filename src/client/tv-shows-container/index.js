/**
 * Module Dependencies
 */

import $ from 'jquery'
import page from 'page'
import socketio from 'socket.io-client'

let socket = socketio()

let $tvShowsContainer = $('#app-body').find('.tv-shows')

$tvShowsContainer.on('click', 'button.like', function (ev) {
  let $this = $(this)
  let $article = $this.closest('.tv-show')
  let id = $article.data('id')

  socket.emit('vote', id)
  $article.toggleClass('liked')
})

$tvShowsContainer.on('click', 'button.chat', function (ev) {
  let $this = $(this)
  let $article = $this.closest('.tv-show')
  let id = $article.data('id')

  page('/chat/' + id)
})

$tvShowsContainer.on('keypress', '.chat-nick', function (ev) {
  let $this = $(this)
  let $chatInput = $('.chat-input')

  $chatInput.prop('disabled', $this.val().length === 0)
})

socket.on('vote:done', vote => {
  let id = vote.showId
  let $article = $tvShowsContainer.find('article[data-id=' + id + ']')
  let counter = $article.find('.count')
  counter.html(vote.count)
})

export default $tvShowsContainer
