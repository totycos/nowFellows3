class CreateKeywords < ActiveRecord::Migration[5.1]
  def change
    create_table :keywords, id:false do |t|
      t.string :id, null:false
      t.string :text
      t.string :img
      t.integer :skill
      t.integer :interest
      t.string :yes_id, index:true
      t.string :no_id, index:true
      t.timestamps
    end

    add_index :keywords, :id, unique: true

  end
end
