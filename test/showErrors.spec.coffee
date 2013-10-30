describe 'showErrors', ->
  $compile = undefined
  $rootScope = undefined

  beforeEach module('ui.bootstrap.showErrors')
  beforeEach inject((_$compile_, _$rootScope_) ->
    $compile = _$compile_
    $rootScope = _$rootScope_
  )

  describe 'directive does not contain an input element with a name attribute', ->
    it 'throws an exception', ->
      expect( ->
        $compile('<div class="form-group" show-errors><input type="text"></input></div>')($rootScope)
      ).toThrow "show-errors element has no input elements with a 'name' attribute"

  it "adds 'has-error' class", ->
    $rootScope.$digest()
    expect(element).toHaveClass('has-error')

  it "throws an exception if the element doesn't have the form-group class", ->
    expect( ->
      $compile('<div show-errors></div>')($rootScope)
    ).toThrow "show-errors element does not have the 'form-group' class"
