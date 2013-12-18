describe 'showErrors', ->
  $compile = undefined
  $scope = undefined
  validName = 'Paul'
  invalidName = 'Pa'

  beforeEach module('ui.bootstrap.showErrors')
  beforeEach inject((_$compile_, _$rootScope_) ->
    $compile = _$compile_
    $scope = _$rootScope_
  )

  compileEl = ->
    el = $compile(
        '<form name="userForm">
          <div id="first-name-group" class="form-group" show-errors>
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" />
          </div>
          <div class="form-group" show-errors>
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" />
          </div>
        </form>'
      )($scope)
    $scope.$digest()
    el

  triggerEvent = (nativeEl, eventName) ->
    nativeEl.dispatchEvent new Event(eventName)

  find = (el, selector) ->
    el[0].querySelector selector

  firstNameEl = (el) ->
    find el, '[name=firstName]'

  firstNameGroup = (el) ->
    angular.element find(el, '#first-name-group')

  expectFormGroupHasErrorClass = (el) ->
    expect(firstNameGroup(el).hasClass('has-error'))

  describe 'directive does not contain an input element with a name attribute', ->
    it 'throws an exception', ->
      expect( ->
        $compile('<div class="form-group" show-errors><input type="text"></input></div>')($scope)
      ).toThrow "show-errors element has no child input elements with a 'name' attribute"

  it "throws an exception if the element doesn't have the form-group class", ->
    expect( ->
      $compile('<div show-errors></div>')($scope)
    ).toThrow "show-errors element does not have the 'form-group' class"

  it "throws an exception if the element isn't in a form tag", ->
    expect( ->
      $compile('<div class="form-group" show-errors><input type="text" name="firstName"></input></div>')($scope)
    ).toThrow()

  describe "when $pristine && $invalid", ->
    it "does not have the 'has-error' class", ->
      el = compileEl()
      expectFormGroupHasErrorClass(el).toBe false

  describe 'when $dirty && $invalid', ->
    describe 'and blurred', ->
      it "has the 'has-error' class", ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue invalidName
        triggerEvent firstNameEl(el), 'blur'
        expectFormGroupHasErrorClass(el).toBe true

    describe 'and not blurred', ->
      it "does not have the 'has-error' class", ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue invalidName
        triggerEvent firstNameEl(el), 'keydown'
        expectFormGroupHasErrorClass(el).toBe false

  describe 'when $dirty && $valid', ->
    describe 'and blurred', ->
      it "does not have the 'has-error' class", ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue validName
        triggerEvent firstNameEl(el), 'blur'
        expectFormGroupHasErrorClass(el).toBe false

    describe 'and other input is $invalid', ->
      it "does not have the 'has-error' class", ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue validName
        $scope.userForm.lastName.$setViewValue invalidName
        triggerEvent firstNameEl(el), 'blur'
        expectFormGroupHasErrorClass(el).toBe false
