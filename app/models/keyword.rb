class Keyword < ApplicationRecord
	self.primary_key = "id"
	has_one :yes, class_name: "Keyword", foreign_key: "yes_id"
	has_one :no, class_name: "Keyword", foreign_key: "no_id"
end
