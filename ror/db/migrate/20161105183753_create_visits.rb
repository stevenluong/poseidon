class CreateVisits < ActiveRecord::Migration
  def change
    create_table :visits do |t|
      t.string :ip
      t.datetime :firstDate
      t.string :target
      t.string :source
      t.string :description
      t.string :raw

      t.timestamps null: false
    end
  end
end
