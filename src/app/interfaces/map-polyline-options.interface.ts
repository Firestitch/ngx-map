export interface FsMapPolylineOptions extends google.maps.PolylineOptions {
  events?: {
    click?: (event) => void
  }
}
