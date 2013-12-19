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

  describe '$pristine', ->
    describe '$invalid', ->
      it 'has-error is absent', ->
        el = compileEl()
        expectFormGroupHasErrorClass(el).toBe false

  describe '$dirty', ->
    describe '$invalid', ->
      describe 'blurred', ->
        it 'has-error is present', ->
          el = compileEl()
          $scope.userForm.firstName.$setViewValue invalidName
          browserTrigger firstNameEl(el), 'blur'
          expectFormGroupHasErrorClass(el).toBe true
      describe 'not blurred', ->
        it 'has-error is absent', ->
          el = compileEl()
          $scope.userForm.firstName.$setViewValue invalidName
          browserTrigger firstNameEl(el), 'keydown'
          expectFormGroupHasErrorClass(el).toBe false

    describe '$valid', ->
      describe 'blurred', ->
        it 'has-error is absent', ->
          el = compileEl()
          $scope.userForm.firstName.$setViewValue validName
          browserTrigger firstNameEl(el), 'blur'
          expectFormGroupHasErrorClass(el).toBe false
        describe 'becomes $invalid again', ->
          describe 'before blurred', ->
            it 'has-error is present', ->
              el = compileEl()
              $scope.userForm.firstName.$setViewValue validName
              browserTrigger firstNameEl(el), 'blur'
              $scope.userForm.firstName.$setViewValue invalidName
              $scope.$digest()
              expectFormGroupHasErrorClass(el).toBe true
            describe 'becomes $valid again before blurred', ->
              it 'has-error is absent', ->
                el = compileEl()
                $scope.userForm.firstName.$setViewValue validName
                browserTrigger firstNameEl(el), 'blur'
                $scope.userForm.firstName.$setViewValue invalidName
                $scope.$digest()
                $scope.userForm.firstName.$setViewValue validName
                $scope.$digest()
                expectFormGroupHasErrorClass(el).toBe false
          describe 'after blurred', ->
            it 'has-error is present', ->
              el = compileEl()
              $scope.userForm.firstName.$setViewValue validName
              browserTrigger firstNameEl(el), 'blur'
              $scope.userForm.firstName.$setViewValue invalidName
              browserTrigger firstNameEl(el), 'blur'
              expectFormGroupHasErrorClass(el).toBe true
            describe 'becomes $valid again after blurred', ->
              it 'has-error is absent', ->
                el = compileEl()
                $scope.userForm.firstName.$setViewValue validName
                browserTrigger firstNameEl(el), 'blur'
                $scope.userForm.firstName.$setViewValue invalidName
                browserTrigger firstNameEl(el), 'blur'
                $scope.userForm.firstName.$setViewValue validName
                browserTrigger firstNameEl(el), 'blur'
                expectFormGroupHasErrorClass(el).toBe false
      describe 'other input is $invalid and blurred', ->
        it 'has-error is absent', ->
          el = compileEl()
          $scope.userForm.firstName.$setViewValue validName
          $scope.userForm.lastName.$setViewValue invalidName
          browserTrigger firstNameEl(el), 'blur'
          expectFormGroupHasErrorClass(el).toBe false
