showErrorsModule = angular.module('ui.bootstrap.showErrors', [])

showErrorsModule.directive 'showErrors',
['$timeout', 'showErrorsConfig', '$interpolate', ($timeout, showErrorsConfig, $interpolate) ->
    
    getTrigger = (options) ->
      trigger = showErrorsConfig.trigger
      if options && options.trigger?
        trigger = options.trigger
      trigger
    
    getShowSuccess = (options) ->
      showSuccess = showErrorsConfig.showSuccess
      if options && options.showSuccess?
        showSuccess = options.showSuccess
      showSuccess

    linkFn = (scope, el, attrs, formCtrl) ->
      blurred = false
      options = scope.$eval attrs.showErrors
      showSuccess = getShowSuccess options
      trigger = getTrigger options

      inputEls   = el[0].querySelectorAll ['.form-control[name]', 'input[name][type=radio], input[name][type=checkbox]']
      unless inputEls.length > 0
        throw "show-errors element has no child input elements with a 'name' attribute"

      for inputEl in inputEls
        inputNgEl = angular.element inputEl
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope)

        inputNgEl.bind trigger, ->
          blurred = true
          toggleClasses formCtrl[inputName].$invalid

        scope.$watch ->
          formCtrl[inputName] && formCtrl[inputName].$invalid
        , (invalid) ->
          return if !blurred
          toggleClasses invalid

        scope.$on 'show-errors-check-validity', ->
          toggleClasses formCtrl[inputName].$invalid

      scope.$on 'show-errors-reset', ->
        $timeout ->
          # want to run this after the current digest cycle
          el.removeClass 'has-error'
          el.removeClass 'has-success'
          blurred = false
        , 0, false

      toggleClasses = (invalid) ->
        el.toggleClass 'has-error', invalid
        if showSuccess
          el.toggleClass 'has-success', !invalid

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        linkFn
    }
]

showErrorsModule.provider 'showErrorsConfig', ->
  _showSuccess = false
  _trigger = 'blur'

  @showSuccess = (showSuccess) ->
    _showSuccess = showSuccess
    
  @trigger = (trigger) ->
    _trigger = trigger

  @$get = ->
    showSuccess: _showSuccess
    trigger: _trigger

  return
