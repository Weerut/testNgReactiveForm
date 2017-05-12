import { TestReactiveFormPage } from './app.po';

describe('test-reactive-form App', () => {
  let page: TestReactiveFormPage;

  beforeEach(() => {
    page = new TestReactiveFormPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
