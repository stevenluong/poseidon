json.array!(@visits) do |visit|
  json.extract! visit, :id, :ip, :firstDate, :target, :source, :description, :raw
  json.url visit_url(visit, format: :json)
end
