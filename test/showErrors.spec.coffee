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
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" class="form-control" />
          </div>
          <div id="last-name-group" class="form-group" show-errors="{ showSuccess: true }">
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" class="form-control" />
          </div>
        </form>'
      )($scope)
    angular.element(document.body).append el
    $scope.$digest()
    el

  describe 'directive does not contain an input element with a form-control class and name attribute', ->
    it 'throws an exception', ->
      expect( ->
        $compile('<form name="userForm"><div class="form-group" show-errors><input type="text" name="firstName"></input></div></form>')($scope)
      ).toThrow "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class"

  it "throws an exception if the element doesn't have the form-group or input-group class", ->
    expect( ->
      $compile('<div show-errors></div>')($scope)
    ).toThrow "show-errors element does not have the 'form-group' or 'input-group' class"

  it "doesn't throw an exception if the element has the input-group class", ->
    expect( ->
      $compile('<form name="userForm"><div class="input-group" show-errors><input class="form-control" type="text" name="firstName"></input></div></form>')($scope)
    ).not.toThrow()

  it "doesn't throw an exception if the element doesn't have the form-group class but uses the skipFormGroupCheck option", ->
    expect( ->
      $compile('<form name="userForm"><div show-errors="{ skipFormGroupCheck: true }"><input class="form-control" type="text" name="firstName"></input></div></form>')($scope)
    ).not.toThrow()

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
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      expectFormGroupHasErrorClass(el).toBe true

  describe '$dirty && $invalid && not blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'keydown'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred then becomes $invalid before blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      expectFormGroupHasErrorClass(el).toBe true

  describe '$valid && blurred then becomes $valid before blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue validName
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && blurred then becomes $invalid after blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      expectFormGroupHasErrorClass(el).toBe true

  describe '$valid && blurred then $invalid after blurred then $valid after blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$valid && other input is $invalid && blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      $scope.userForm.lastName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      expectFormGroupHasErrorClass(el).toBe false

  describe '$invalid && showErrorsCheckValidity is set before blurred', ->
    it 'has-error is present', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$broadcast 'show-errors-check-validity'
      expectFormGroupHasErrorClass(el).toBe true
      
  describe 'showErrorsCheckValidity is called twice', ->
    it 'correctly applies the has-error class', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$broadcast 'show-errors-check-validity'
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.userForm.firstName.$setViewValue invalidName
      $scope.$apply ->
        $scope.showErrorsCheckValidity = true
      expectFormGroupHasErrorClass(el).toBe true

  describe 'showErrorsReset', ->
    it 'removes has-error', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$broadcast 'show-errors-reset'
      $timeout.flush()
      expectFormGroupHasErrorClass(el).toBe false

  describe 'showErrorsReset then invalid without blurred', ->
    it 'has-error is absent', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue validName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$broadcast 'show-errors-reset'
      $timeout.flush()
      $scope.$apply ->
        $scope.userForm.firstName.$setViewValue invalidName
      expectFormGroupHasErrorClass(el).toBe false

  describe 'call showErrorsReset multiple times', ->
    it 'removes has-error', ->
      el = compileEl()
      $scope.userForm.firstName.$setViewValue invalidName
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$broadcast 'show-errors-reset'
      $timeout.flush()
      angular.element(firstNameEl(el)).triggerHandler 'blur'
      $scope.$broadcast 'show-errors-reset'
      $timeout.flush()
      expectFormGroupHasErrorClass(el).toBe false

  describe '{showSuccess: true} option', ->
    describe '$pristine && $valid', ->
      it 'has-success is absent', ->
        el = compileEl()
        expectLastNameFormGroupHasSuccessClass(el).toBe false

    describe '$dirty && $valid && blurred', ->
      it 'has-success is present', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue validName
        angular.element(lastNameEl(el)).triggerHandler 'blur'
        $scope.$digest()
        expectLastNameFormGroupHasSuccessClass(el).toBe true

    describe '$dirty && $invalid && blurred', ->
      it 'has-success is present', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue invalidName
        angular.element(lastNameEl(el)).triggerHandler 'blur'
        $scope.$digest()
        expectLastNameFormGroupHasSuccessClass(el).toBe false

    describe '$invalid && blurred then becomes $valid before blurred', ->
      it 'has-success is present', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue invalidName
        angular.element(lastNameEl(el)).triggerHandler 'blur'
        $scope.$apply ->
          $scope.userForm.lastName.$setViewValue invalidName
        $scope.$apply ->
          $scope.userForm.lastName.$setViewValue validName
        expectLastNameFormGroupHasSuccessClass(el).toBe true

    describe '$valid && showErrorsCheckValidity is set before blurred', ->
      it 'has-success is present', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue validName
        $scope.$broadcast 'show-errors-check-validity'
        expectLastNameFormGroupHasSuccessClass(el).toBe true

    describe 'showErrorsReset', ->
      it 'removes has-success', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue validName
        angular.element(lastNameEl(el)).triggerHandler 'blur'
        $scope.$broadcast 'show-errors-reset'
        $timeout.flush()
        expectLastNameFormGroupHasSuccessClass(el).toBe false

describe 'showErrorsConfig', ->
  $compile = undefined
  $scope = undefined
  $timeout = undefined
  validName = 'Paul'
  invalidName = 'Pa'

  beforeEach ->
    testModule = angular.module 'testModule', []
    testModule.config (showErrorsConfigProvider) ->
      showErrorsConfigProvider.showSuccess true
      showErrorsConfigProvider.trigger 'keypress'

    module 'ui.bootstrap.showErrors', 'testModule'

    inject((_$compile_, _$rootScope_, _$timeout_) ->
      $compile = _$compile_
      $scope = _$rootScope_
      $timeout = _$timeout_
    )

  compileEl = ->
    el = $compile(
        '<form name="userForm">
          <div id="first-name-group" class="form-group" show-errors="{showSuccess: false, trigger: \'blur\'}">
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" class="form-control" />
          </div>
          <div id="last-name-group" class="form-group" show-errors>
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" class="form-control" />
          </div>
        </form>'
      )($scope)
    angular.element(document.body).append el
    $scope.$digest()
    el

  describe 'when showErrorsConfig.showSuccess is true', ->
    describe 'and no options given', ->
      it 'show-success class is applied', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue validName
        angular.element(lastNameEl(el)).triggerHandler 'keypress'
        $scope.$digest()
        expectLastNameFormGroupHasSuccessClass(el).toBe true

  describe 'when showErrorsConfig.showSuccess is true', ->
    describe 'but options.showSuccess is false', ->
      it 'show-success class is not applied', ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue validName
        angular.element(firstNameEl(el)).triggerHandler 'blur'
        $scope.$digest()
        expectFirstNameFormGroupHasSuccessClass(el).toBe false

  describe 'when showErrorsConfig.trigger is "keypress"', ->
    describe 'and no options given', ->
      it 'validates the value on the first keypress', ->
        el = compileEl()
        $scope.userForm.lastName.$setViewValue invalidName
        angular.element(lastNameEl(el)).triggerHandler 'keypress'
        $scope.$digest()
        expectLastNameFormGroupHasErrorClass(el).toBe true

    describe 'but options.trigger is "blur"', ->
      it 'does not validate the value on keypress', ->
        el = compileEl()
        $scope.userForm.firstName.$setViewValue invalidName
        angular.element(firstNameEl(el)).triggerHandler 'keypress'
        $scope.$digest()
        expectFirstNameFormGroupHasErrorClass(el).toBe false

find = (el, selector) ->
  el[0].querySelector selector

firstNameEl = (el) ->
  find el, '[name=firstName]'

lastNameEl = (el) ->
  find el, '[name=lastName]'

expectFormGroupHasErrorClass = (el) ->
  formGroup = el[0].querySelector '[id=first-name-group]'
  expect angular.element(formGroup).hasClass('has-error')

expectFirstNameFormGroupHasSuccessClass = (el) ->
  formGroup = el[0].querySelector '[id=first-name-group]'
  expect angular.element(formGroup).hasClass('has-success')

expectLastNameFormGroupHasSuccessClass = (el) ->
  formGroup = el[0].querySelector '[id=last-name-group]'
  expect angular.element(formGroup).hasClass('has-success')

expectFirstNameFormGroupHasErrorClass = (el) ->
  formGroup = el[0].querySelector '[id=first-name-group]'
  expect angular.element(formGroup).hasClass('has-error')

expectLastNameFormGroupHasErrorClass = (el) ->
  formGroup = el[0].querySelector '[id=last-name-group]'
  expect angular.element(formGroup).hasClass('has-error')
