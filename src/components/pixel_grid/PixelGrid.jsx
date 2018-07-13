import React, { Component } from 'react';
import './PixelGrid.css'
import Modal from 'react-modal';

const url_expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
const url_regex = new RegExp(url_expression)
const DIMENSION = 20
const COLORS = {
  0       : { hex:'#ffffff' }, // white?
  1       : { hex: '#76c4Ae', label: 'Green' }, // green
  2       : { hex: '#7CE0F9', label: 'Blue' }, // blue
  3       : { hex: '#CABD80', label: 'Yellow' }, // yellow
  4       : { hex: '#D86C70', label: 'Red' }, // red
}

class PixelGrid extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected_coords_x: null,
      selected_coords_y: null,
      selected_new_color: 0,
      custom_color: '',
    }
  }

  setSelectedCoords(i, j){
    this.setState({
      selected_coords_x: i,
      selected_coords_y: j
    })
  }

  closeModal() {
    this.setSelectedCoords(null, null)
  }

  async updateCoordsColor() {
    const {
      selected_coords_x,
      selected_coords_y,
      selected_new_color,
      custom_color
    } = this.state


    console.log("calling function")
    await this.props.claimPixel(
      selected_coords_x,
      selected_coords_y,
      selected_new_color === -1 ? custom_color : selected_new_color
    )
    console.log("done")
  }

  render() {
    const {
      board,
      is_loading
    } = this.props

    const {
      selected_coords_x,
      selected_coords_y,
      selected_new_color,
      custom_color,
    } = this.state

    if (is_loading){
      return <div> is loading board... </div>
    }

    const rows = Object.keys(board)

    return (
      <div>
        <table>
          <tbody>
            {
              rows.map(row => {
                const cols = Object.keys(board[row])
                return <tr key={row}>
                  {
                    cols.map(col => {
                      const pixel = board[row][col]
                      const is_selected = (selected_coords_x === row) && (selected_coords_y === col)
                      const is_image = pixel.match(url_regex)
                      return (
                        <td
                          key={`${row}-${col}`}
                          onClick={this.setSelectedCoords.bind(this, row, col)}
                          style={{background: is_image ? undefined : pixel}}
                        >
                          {
                            is_image ? <img src={pixel} style={{
                              width: '100%',
                              height: '100%',
                            }}/> : undefined
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              })
            }
          </tbody>
        </table>

        <Modal
          isOpen={selected_coords_x !== null}
          onRequestClose={this.closeModal.bind(this)}
          style={{
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          }}
          contentLabel="Example Modal"
        >
          <h2>Update Cell @ ({selected_coords_y}, {selected_coords_x})</h2>
          {
            Object.keys(COLORS).map(color_index => {

              if (color_index === "0"){
                return undefined
              }

              const color = COLORS[color_index]

              return (
                <div className="radio">
                  <label>
                    <input type="radio" onChange={e => {
                      this.setState({selected_new_color: color.hex})
                    }} checked={color.hex === selected_new_color} />
                    {color.label}
                  </label>
                </div>
              )
            })
          }
        
          <div className="radio">
            <label>
              <input type="radio" onChange={e => {
                this.setState({selected_new_color: -1})
              }} checked={-1 === selected_new_color} />
              Custom
            </label>
            <input value={custom_color} onChange={e => {
              this.setState({custom_color: e.target.value})
            }}/>
          </div>

          <br/>

          <button onClick={this.updateCoordsColor.bind(this)}> Submit </button>
        
        </Modal>

      </div>

    );
  }

}

export default PixelGrid;
