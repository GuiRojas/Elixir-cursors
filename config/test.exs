import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :phoenix_cursors, PhoenixCursorsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "zfB4LHsQtd+TOSRtkgGdmP2nOX5ZcG+6kUn76Bc5Mi1ASbv2y6Slw1Bklj+0UBwV",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
