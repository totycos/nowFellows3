require 'test_helper'

class QuizControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get quiz_show_url
    assert_response :success
  end

  test "should get validate" do
    get quiz_validate_url
    assert_response :success
  end

end
