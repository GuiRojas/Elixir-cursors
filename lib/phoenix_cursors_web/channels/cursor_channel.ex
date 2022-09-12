defmodule PhoenixCursorsWeb.CursorChannel do
  alias PhoenixCursorsWeb.Presence
  use PhoenixCursorsWeb, :channel

  @impl true
  def join("cursor:lobby", _payload, socket) do
    send(self(), :after_join)
    {:ok, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.current_user, %{
        online_at: inspect(System.system_time(:second)),
        color: PhoenixCursors.Colors.getHSL(socket.assigns.current_user)
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # handle mouse movement
  @impl true
  def handle_in("move", %{"x" => x, "y" => y}, socket) do
    {:ok, _} = 
      Presence.update(socket, socket.assigns.current_user, fn previousState ->
        Map.merge(
          previousState,
          %{
            online_at: inspect(System.system_time(:second)),
            color: PhoenixCursors.Colors.getHSL(socket.assigns.current_user),
            x: x,
            y: y
          }
        )
      end)

    {:noreply, socket}
  end

  # handle sending messages
  @impl true
  def handle_in("msg_send", %{"msg" => msg}, socket) do
    {:ok, _} =
      Presence.update(socket, socket.assigns.current_user, fn previousState ->
        Map.merge(
          previousState,
          %{
            online_at: inspect(System.system_time(:second)),
            msg: msg
          }
        )
      end)

    {:noreply, socket}
  end
end
