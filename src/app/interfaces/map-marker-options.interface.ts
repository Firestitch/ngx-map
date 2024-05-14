export interface FsMapMarkerOptions extends google.maps.marker.AdvancedMarkerElementOptions {
  events?: {
    click?: (event) => void
    drag?: (event) => void
    dragend?: (event) => void
    dragstart?: (event) => void
  }
}
