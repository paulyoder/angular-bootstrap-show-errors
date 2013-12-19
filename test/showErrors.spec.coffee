describe 'showErrors', ->
  $compile = undefined
  $scope = undefined
  $timeout = undefined
  validName = 'Paul'
  invalidName = 'Pa'

  beforeEach module('ui.bootstrap.showErrors')
  beforeEach inject((_$compile_, _$rootScope_, _$timeout_) ->
    $compile = _$compile_
    $scope = _$rootScope_
    $timeout = _$timeout_
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

  describe '$pristine && $invalid', ->
    it 'has-error is absent', ->
      el = compileEl()
      expectFormGroupHasErrorClass(el).toBe false

  describe '$dirty && $invalid && blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'blur'
      expectFormGroupHasErrorClass(el).toBe true
      describe 'not blurred', ->

  describe '$dirty && $invalid && not blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'keydown'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred then becomes $invalid before blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      expectFormGroupHasErrorClass(el).toBe true

  describe '$valid && blurred then becomes $valid before blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue validName
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred then becomes $invalid after blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'blur'
      expectFormGroupHasErrorClass(el).toBe true

  describe '$valid && blurred then $invalid after blurred then $valid after blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'blur'
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && other input is $invalid && blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      $scope.userForm.lastName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$invalid && showErrorsCheckValidity is set before blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.showErrorsCheckValidity = true
      expectFormGroupHasErrorClass(el).toBe true
      
  describe 'showErrorsCheckValidity is called twice', ->
    it 'correctly applies the has-error class', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.showErrorsCheckValidity = true
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.showErrorsCheckValidity = true
      expectFormGroupHasErrorClass(el).toBe true

  describe 'showErrorsReset', ->
    it 'removes has-error', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      browserTrigger firstNameEl(el), 'blur'
      $scope.$apply ->
        $scope.showErrorsReset = true
      $timeout.flush()
      expectFormGroupHasErrorClass(el).toBe false

  describe 'showErrorsReset then invalid without blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      browserTrigger firstNameEl(el), 'blur'
      $scope.$apply ->
        $scope.showErrorsReset = true
      $timeout.flush()
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      expectFormGroupHasErrorClass(el).toBe false
