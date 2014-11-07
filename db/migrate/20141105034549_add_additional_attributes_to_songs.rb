class AddAdditionalAttributesToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :soundcloud_id, :integer
    add_column :songs, :duration, :integer
  end
end
